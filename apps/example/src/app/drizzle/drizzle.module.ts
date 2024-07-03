import { DrizzlePostgresModule } from '@nestjs-drizzle/postgres-js';
import { Module } from '@nestjs/common';
import { dzSchema } from './drizzle.schema';

@Module({
  imports: [
    DrizzlePostgresModule.register({
      postgres: {
        url: 'postgres://postgres:postgres@localhost:5432/postgres',
      },
      config: { schema: dzSchema },
    }),
    DrizzlePostgresModule.register({
      name: 'named_db',
      postgres: {
        url: 'postgres://postgres:postgres@localhost:5432/postgres',
      },
      config: { schema: dzSchema },
    }),
  ],
})
export class DrizzleModule {}
