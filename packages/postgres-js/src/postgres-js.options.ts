import type { DrizzleConfig } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { Options, PostgresType } from 'postgres';

export type DrizzlePostgresOptions = {
  name?: string;
  postgres: {
    url: string;
    config?: Options<Record<string, PostgresType>> | undefined;
  };
  config?: DrizzleConfig<Record<string, unknown>>;
};

export type DrizzlePostgres<
  TSchema extends Record<string, unknown> = Record<string, unknown>
> = PostgresJsDatabase<TSchema>;
