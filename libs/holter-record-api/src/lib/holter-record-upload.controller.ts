/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { HolterRecordService } from './services/holter-record.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import * as Papa from 'papaparse';

@Controller('holter-record-upload')
export class HolterRecordUploadController {
  constructor(private holterRecordService: HolterRecordService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('csvFile'))
  uploadFile(
    @UploadedFile() file: any,
    @Body()
    body: {
      name: string;
      startTime: number;
    }
  ) {
    if (!file || !body.name || !body.startTime) {
      return {
        error: 'Not enough parameters: name, startTime, csvFile required',
      };
    }

    const csvDataString = file.buffer.toString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const csvData = Papa.parse(csvDataString).data as any;
    try {
      this.holterRecordService.saveHolterRecords(
        body.name,
        body.startTime,
        csvData
      );

      return { success: 'uploaded success' };
    } catch (error) {
      return { error: 'error in csv structure' };
    }
  }
}
