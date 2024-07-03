import { InjectDrizzle } from '@nestjs-drizzle/core';
import { DrizzlePostgres } from '@nestjs-drizzle/postgres-js';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { sql } from 'drizzle-orm';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(@InjectDrizzle() private readonly drizzle: DrizzlePostgres) {}

  async onApplicationBootstrap() {
    console.log(
      await this.drizzle.execute(sql`
        SELECT schema_name
        FROM information_schema.schemata;
        `)
    );
  }

  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
