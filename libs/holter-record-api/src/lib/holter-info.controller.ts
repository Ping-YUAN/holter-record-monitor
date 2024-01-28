import { Controller, Get, Param, Query } from '@nestjs/common';
import { HolterRecordService } from './services/holter-record.service';

@Controller('holter-info')
export class HolterInfoController {
  constructor(private holterRecordService: HolterRecordService) {}

  @Get('/:username?')
  getHolterRecordSummaryByUserByTime(
    @Param('username') name: string,
    @Query('start') start?: number,
    @Query('end') end?: number,
    @Query('low') low?: number,
    @Query('high') high?: number
  ) {
    const summary = this.holterRecordService.getHolterRecordSummaryByUserByTime(
      name,
      start,
      end,
      low,
      high
    );
    return summary;
  }
}
