import * as dzSchema from './schema';
import { DrizzlePostgres } from '@nestjs-drizzle/postgres-js';

export * as dzSchema from './schema';
export type DrizzleSchema = typeof dzSchema;
export type DrizzleDb = DrizzlePostgres<DrizzleSchema>;
