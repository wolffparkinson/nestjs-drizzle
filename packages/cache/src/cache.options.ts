import type { RedisClientOptions } from 'redis';

export type DrizzleCacheModuleOptions = {
  schema: Record<string, unknown>;
  redis: RedisClientOptions;
  isGlobal?: boolean;
};
