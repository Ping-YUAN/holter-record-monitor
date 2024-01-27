import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HolterRecordApiModule } from '@holter-record-api';

@Module({
  imports: [HolterRecordApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
