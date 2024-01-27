import { Controller, Get, Param, Query } from '@nestjs/common';
import { HolterRecordService } from './services/holter-record.service';

@Controller('holter-info')
export class HolterInfoController {
  constructor(private holterRecordService: HolterRecordService) {}

  @Get('/:username?')
  getHolterRecordSummaryByUserByTime(
    @Param('username') name: string,
    @Query('start') start?: number,
    @Query('end') end?: number
  ) {
    const summary = this.holterRecordService.getHolterRecordSummaryByUserByTime(
      name,
      start,
      end
    );

    return summary;
  }
}
