import { Table } from 'drizzle-orm';

export function getFullTableName<T extends Table>(table: T): string {
  const Schema = Object.getOwnPropertySymbols(table).find(
    (s) => s.description === 'drizzle:Schema'
  );
  const Name = Object.getOwnPropertySymbols(table).find(
    (s) => s.description === 'drizzle:Name'
  );

  const schemaName = Schema ? `${table[Schema as keyof T]}` : undefined;
  const tableName = `${table[Name as keyof T]}`;

  return schemaName ? `${schemaName}.${tableName}` : tableName;
}
