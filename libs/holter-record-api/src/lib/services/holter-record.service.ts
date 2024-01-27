/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import {
  ECGWaveType,
  HolterRecord,
  HolterRecordItem,
  HolterRecordPatient,
  HolterRecordSummary,
  ONE_MINUTE_MS,
} from '../holter.model';
import { randomUUID } from 'crypto';
import { HolterConnectionService } from './holter-connection.service';

@Injectable()
export class HolterRecordService {
  // in memory data to simulate database better to have a sql data base
  // benefits: 1. easily insert data 2. retrievel data by some filter conditions
  private _holterRecords: HolterRecord[] = [];

  constructor(private holterConnectionService: HolterConnectionService) {}

  saveHolterRecords(name: string, startTime: number, csvData: []) {
    const userIdx = this._holterRecords.findIndex(
      (user) => user.patientName === name
    );
    if (userIdx > -1) {
      //@todo insert records into existing array
    } else {
      const newPatient = {
        patientName: name,
        id: randomUUID(),
        read: false,
        startTime: startTime,
        records: csvData.map((item) => {
          return {
            type: item[0] as string,
            waveStart: Number(item[1]),
            waveEnd: Number(item[2]),
            waveTag: item[3] ? [item[3]] : [],
          } as HolterRecordItem;
        }),
      } as HolterRecord;

      console.log(
        `new Patient's first record: ${JSON.stringify(newPatient.records[0])}
         `
      );
      console.log(
        `new Patient's last 2 record: ${JSON.stringify(
          newPatient.records[newPatient.records.length - 2]
        )}
         `
      );
      this._holterRecords.push(newPatient);
      this.notifyNewData();
    }
  }

  notifyNewData() {
    this.holterConnectionService.sendUpdatedHolterData(
      this._holterRecords.map((item) => {
        return {
          patientName: item.patientName,
          id: item.id,
          read: item.read,
          recordStart: item.records[0].waveStart,
          recordEnd: item.records[item.records.length - 1].waveEnd,
        };
      })
    );
  }

  getHolterRecordSummaryByUserByTime(
    name: string,
    start: number | undefined | null,
    end: number | undefined | null
  ): HolterRecordPatient | null {
    const user = this._holterRecords.find(
      (item) => item.patientName === name || item.id === name
    );
    console.log(
      `user is ${user?.patientName} and it's record is ${user?.records.length}`
    );
    if (user) {
      const summary = {
        avgHeartRate: 0,
        minHeartRate: Infinity,
        minHeartRateTime: 0,
        maxHeartRate: -Infinity,
        maxHeartRateTime: 0,
      };
      const recordSummary = {
        qrsCount: 0,
        timeCount: 0,
        oneMinuteStart: 0,
        oneMinuteQrsCount: 0,
      };
      // the start idx can be found by the start parameter with binary search over the record array
      const startIdx = 0;
      for (let i = 0; i < user.records.length; i++) {
        if (end && user.records[i].waveStart > end) break;
        if (
          !user.records[i].type ||
          !user.records[i].waveEnd ||
          !user.records[i].waveStart
        )
          continue;
        const timeDuration =
          user.records[i].waveEnd - user.records[i].waveStart;
        recordSummary.timeCount = user.records[i].waveEnd;
        if (recordSummary.oneMinuteStart < 0)
          recordSummary.oneMinuteStart = user.records[i].waveStart;

        if (user.records[i].type.toUpperCase() == ECGWaveType.QRS) {
          recordSummary.qrsCount++;
          recordSummary.oneMinuteQrsCount++;
        }

        // check for max and min;
        const intervalMilleSeconds = Number(
          user.records[i].waveEnd - recordSummary.oneMinuteStart
        );
        if (intervalMilleSeconds >= ONE_MINUTE_MS) {
          const heartRate =
            recordSummary.oneMinuteQrsCount /
            (intervalMilleSeconds / ONE_MINUTE_MS);
          const dateStamp =
            Number(user.startTime) + Number(user.records[i].waveStart);
          if (summary.minHeartRate > heartRate) {
            summary.minHeartRate = heartRate;
            summary.minHeartRateTime = dateStamp - ONE_MINUTE_MS;
          }
          if (summary.maxHeartRate < heartRate) {
            summary.maxHeartRate = heartRate;
            summary.maxHeartRateTime = dateStamp - ONE_MINUTE_MS;
          }
          recordSummary.oneMinuteStart = -1;
          recordSummary.oneMinuteQrsCount = 0;
          //   break;
        }
      }

      summary.avgHeartRate =
        recordSummary.qrsCount / (recordSummary.timeCount / ONE_MINUTE_MS);
      console.log(
        `qrs total is ${recordSummary.qrsCount} time is ${recordSummary.timeCount} heart reate is ${summary.avgHeartRate}`
      );
      user.read = true;
      const holterRecordSummary = {
        patientName: user?.patientName,
        id: user?.id,
        read: user?.read,
        ...summary,
      } as HolterRecordSummary;
      this.notifyNewData();
      return holterRecordSummary;
    }

    return null;
  }
}
