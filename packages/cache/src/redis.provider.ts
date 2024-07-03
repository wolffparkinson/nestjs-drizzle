import { FactoryProvider } from '@nestjs/common';
import { createClient } from 'redis';
import { REDIS_CLIENT } from './cache.constants';
import { MODULE_OPTIONS_TOKEN } from './cache.module-definition';
import { DrizzleCacheModuleOptions } from './cache.options';
import { RedisClient } from 'redis-stores';

export const RedisClientProvider: FactoryProvider<RedisClient> = {
  provide: REDIS_CLIENT,
  inject: [MODULE_OPTIONS_TOKEN],
  useFactory: async (options: DrizzleCacheModuleOptions) => {
    const client = createClient(options.redis);
    await client.connect();
    return client;
  },
};
