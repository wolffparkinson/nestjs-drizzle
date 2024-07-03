import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './postgres-js.module-definition';
import { DrizzlePostgresOptions } from './postgres-js.options';
import { DrizzlePostgresProvider } from './postgres-js.provider';
import { getDrizzleToken } from '@nestjs-drizzle/core';

@Global()
@Module({})
export class DrizzlePostgresModule extends ConfigurableModuleClass {
  static register(options: DrizzlePostgresOptions): DynamicModule {
    const { providers = [], exports = [], ...props } = super.register(options);

    providers.push(DrizzlePostgresProvider, {
      provide: getDrizzleToken(options.name),
      inject: [DrizzlePostgresProvider],
      useFactory: async (drizzle: DrizzlePostgresProvider) => {
        return drizzle.create(options);
      },
    });

    exports.push(getDrizzleToken(options.name));
    return {
      ...props,
      providers,
      exports,
    };
  }

  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    const {
      providers = [],
      exports = [],
      ...props
    } = super.registerAsync(options);

    providers.push(DrizzlePostgresProvider, {
      provide: getDrizzleToken(options.name),
      useFactory: async (
        drizzle: DrizzlePostgresProvider,
        opts: DrizzlePostgresOptions
      ) => {
        return await drizzle.create(opts);
      },
      inject: [DrizzlePostgresProvider, MODULE_OPTIONS_TOKEN],
    });

    exports.push(getDrizzleToken(options.name));

    return {
      ...props,
      providers,
      exports,
    };
  }
}
