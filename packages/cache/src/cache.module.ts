import { Module } from '@nestjs/common';
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './cache.module-definition';
import { DrizzleCacheProvider } from './cache.provider';
import { RedisClientProvider } from './redis.provider';

@Module({
  providers: [DrizzleCacheProvider, RedisClientProvider],
  exports: [DrizzleCacheProvider, RedisClientProvider, MODULE_OPTIONS_TOKEN],
})
export class DrizzleCacheModule extends ConfigurableModuleClass {}
