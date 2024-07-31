import { Inject, Injectable } from '@nestjs/common';
import { ExtractTablesWithRelations, Query } from 'drizzle-orm';
import { AnyPgSelect, PgSelectBase } from 'drizzle-orm/pg-core';
import { PgRelationalQuery } from 'drizzle-orm/pg-core/query-builders/query';
import { ObjectStore, RedisClient } from 'redis-stores';
import { REDIS_CLIENT } from './cache.constants';
import { MODULE_OPTIONS_TOKEN } from './cache.module-definition';
import { DrizzleCacheModuleOptions } from './cache.options';
import { getFullTableName } from './utils';

@Injectable()
export class DrizzleCacheProvider<TSchema extends Record<string, unknown>> {
  readonly store: ObjectStore<any>;

  constructor(
    @Inject(REDIS_CLIENT) readonly redis: RedisClient,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: DrizzleCacheModuleOptions
  ) {
    this.store = new ObjectStore({
      client: this.redis,
      prefix: 'drizzle',
      ttl: 120,
    });
  }

  private createQueryId(
    query: AnyPgSelect | PgRelationalQuery<any>,
    scope?: string
  ): string {
    let tablename: string | undefined = undefined,
      sql: Query | undefined = undefined;

    if (query instanceof PgSelectBase) {
      const table = query['config'].table;
      sql = query.toSQL();
      // @ts-expect-error
      tablename = getFullTableName(table);
    }

    if (query instanceof PgRelationalQuery) {
      tablename = getFullTableName(query['table']);
      sql = query.toSQL();
    }

    if (!tablename || !sql) {
      throw new Error('Unknown query type');
    }

    let id = `${tablename}`;
    if (scope) id += `:${scope}`;
    id += `:${JSON.stringify(sql)}`;
    return id;
  }

  async query<Q extends Pick<AnyPgSelect, 'execute' | 'toSQL'>>(
    query: Q,
    options?: DzCachedQueryOptions
  ): Promise<Awaited<ReturnType<Q['execute']>>>;
  async query<T>(
    query: PgRelationalQuery<T>,
    options?: DzCachedQueryOptions
  ): Promise<T>;
  async query(
    query: PgRelationalQuery<any> | AnyPgSelect,
    options?: DzCachedQueryOptions
  ) {
    if (options?.noCache) return query.execute();

    // Generate query ID
    const id = this.createQueryId(query, options?.scope);

    // Fetch cached result
    const cached = await this.store.get(id);
    if (cached !== null) return cached;

    // Execute query
    const result = await query.execute();

    // Cache result
    await this.store.set(id, result, { EX: options?.ttl });

    return result;
  }

  async invalidate(...options: IDzCacheInvalidateOption<TSchema>[]) {
    if (!options.length)
      throw new Error('Atleast one option is required to invalidate cache');

    const patterns = options.flatMap((option) => {
      const table = typeof option === 'string' ? option : option[0];
      const scope = typeof option === 'string' ? undefined : option.at(1);

      const tablename = getFullTableName((this.options.schema as any)[table]);

      if (!scope || !scope.length) return `${tablename}:*`;

      const scopes = Array.isArray(scope) ? scope : [scope];
      return scopes.map((s) => `${tablename}:${s}:*`);
    });

    return this.store.delPatterns(...Array.from(new Set(patterns)));
  }
}

export interface DzCachedQueryOptions {
  scope?: string;
  ttl?: number;
  noCache?: boolean;
}

export type IDzCacheInvalidateOption<TSchema extends Record<string, unknown>> =
  | (keyof ExtractTablesWithRelations<TSchema> & string)
  | [keyof ExtractTablesWithRelations<TSchema>]
  | [keyof ExtractTablesWithRelations<TSchema>, string | string[]];
