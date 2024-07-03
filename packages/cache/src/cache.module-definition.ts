import { ConfigurableModuleBuilder } from '@nestjs/common';
import { DrizzleCacheModuleOptions } from './cache.options';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<DrizzleCacheModuleOptions>()
    .setExtras({ isGlobal: true }, (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }))
    .build();
