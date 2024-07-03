import postgres from 'postgres';
import { DrizzlePostgresOptions } from './postgres-js.options';
import { drizzle } from 'drizzle-orm/postgres-js';
import { Injectable, Logger } from '@nestjs/common';
import { format } from 'sql-formatter';

@Injectable()
export class DrizzlePostgresProvider {
  private readonly logger = new Logger(DrizzlePostgresProvider.name);

  public create(options: DrizzlePostgresOptions) {
    const logger = this.logger;
    const client = postgres(options.postgres.url, options.postgres.config);
    return drizzle(client, {
      logger: {
        logQuery(query, params) {
          if (process.env['NODE_ENV'] === 'production')
            return logger.verbose({ query, params });

          let output = `\n${format(query, {
            language: 'postgresql',
          })}`;
          if (params.length) {
            output += `\n\nParams : ${JSON.stringify(params)}`;
          }

          logger.verbose(output);
        },
      },
      ...options?.config,
    });
  }
}
