import { ConfigurableModuleBuilder } from '@nestjs/common';
import { DrizzlePostgresOptions } from './postgres-js.options';
import { DEFAULT_PROVIDER } from '@nestjs-drizzle/core';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<DrizzlePostgresOptions>()
  .setExtras({ name: DEFAULT_PROVIDER }, (definition, extras) => ({
    ...definition,
    name: extras.name,
  }))
  .build();
