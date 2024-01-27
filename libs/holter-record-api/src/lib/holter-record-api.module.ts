import { Module } from '@nestjs/common';
import { HolterRecordUploadController } from './holter-record-upload.controller';
import { HolterUpdateGateway } from './holter-update.gateway';
import { HolterConnectionService } from './services/holter-connection.service';
import { HolterRecordService } from './services/holter-record.service';
import { HolterInfoController } from './holter-info.controller';

@Module({
  controllers: [HolterRecordUploadController, HolterInfoController],
  providers: [
    HolterUpdateGateway,
    HolterConnectionService,
    HolterRecordService,
  ],
  exports: [],
})
export class HolterRecordApiModule {}
