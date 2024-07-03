import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
