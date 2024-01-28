/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import {
  ECGWaveType,
  HIGH_WARNING_HEART_RATE,
  HOLTER_EXCEPTION,
  HolterHeartRateHistoryItem,
  HolterRecord,
  HolterRecordExceptionItem,
  HolterRecordItem,
  HolterRecordPatient,
  HolterRecordSummary,
  LOW_WARNING_HEART_RATE,
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
        startTime: Number(startTime),
        records: csvData
          .filter((item) => item)
          .map((item) => {
            return {
              type: item[0] as string,
              waveStart: Number(item[1]),
              waveEnd: Number(item[2]),
              waveTag: item[3] ? [item[3]] : [],
            } as HolterRecordItem;
          }),
      } as HolterRecord;

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
    end: number | undefined | null,
    low: number | undefined | null,
    high: number | undefined | null
  ): HolterRecordPatient | null {
    const user = this._holterRecords.find(
      (item) => item.patientName === name || item.id === name
    );

    if (user) {
      const summary = {
        avgHeartRate: 0,
        minHeartRate: Infinity,
        minHeartRateTime: 0,
        maxHeartRate: -Infinity,
        maxHeartRateTime: 0,
        exceptionActivities: [],
        heartRateHistory: [],
      };

      const recordSummary = {
        qrsCount: 0,
        timeCount: 0,
        oneMinuteStart: 0,
        oneMinuteQrsCount: 0,
      };
      // the start idx can be found by the start parameter with binary search over the record array
      const startIdx = start
        ? user.records.findIndex(
            (item) => item && user.startTime + item.waveStart >= start
          )
        : 0;

      for (let i = startIdx; i < user.records.length; i++) {
        if (
          !user.records[i] ||
          (end && user.startTime + user.records[i].waveStart > end)
        ) {
          break;
        }
        if (
          !user.records[i].type ||
          !user.records[i].waveEnd ||
          !user.records[i].waveStart
        )
          continue;

        recordSummary.timeCount =
          user.records[i].waveEnd - user.records[startIdx].waveStart;
        if (recordSummary.oneMinuteStart < 0)
          recordSummary.oneMinuteStart = user.records[i].waveStart;

        if (user.records[i].type.toUpperCase() == ECGWaveType.QRS) {
          recordSummary.qrsCount++;
          recordSummary.oneMinuteQrsCount++;
        }

        // if not a continous time then reset;
        const intervalMilleSeconds =
          user.records[i].waveEnd - recordSummary.oneMinuteStart;
        if (intervalMilleSeconds > 2 * ONE_MINUTE_MS) {
          recordSummary.oneMinuteStart = -1;
          recordSummary.oneMinuteQrsCount = 0;
          continue;
        }
        // calculate result and handle it separately
        if (intervalMilleSeconds >= ONE_MINUTE_MS) {
          const heartRate =
            recordSummary.oneMinuteQrsCount /
            (intervalMilleSeconds / ONE_MINUTE_MS);
          const dateStamp = user.startTime + user.records[i].waveStart;
          // handle max min
          this.handleMaxMin(summary, heartRate, dateStamp);
          // handle history
          this.handleHistory(summary.heartRateHistory, heartRate, dateStamp);
          // handleExceptions
          this.handleException(
            summary.exceptionActivities,
            heartRate,
            dateStamp,
            low,
            high
          );
          recordSummary.oneMinuteStart = -1;
          recordSummary.oneMinuteQrsCount = 0;
        }
      }

      summary.avgHeartRate =
        recordSummary.qrsCount / (recordSummary.timeCount / ONE_MINUTE_MS);

      if (!user.read) {
        user.read = true;
        this.notifyNewData();
      }

      const holterRecordSummary = {
        patientName: user?.patientName,
        id: user?.id,
        read: user?.read,
        ...summary,
      } as HolterRecordSummary;

      return holterRecordSummary;
    }

    return null;
  }

  handleMaxMin(summary, heartRate: number, time: number) {
    // handle min
    if (summary.minHeartRate > heartRate) {
      summary.minHeartRate = heartRate;
      summary.minHeartRateTime = time - ONE_MINUTE_MS;
    }
    // handle max
    if (summary.maxHeartRate < heartRate) {
      summary.maxHeartRate = heartRate;
      summary.maxHeartRateTime = time - ONE_MINUTE_MS;
    }
  }
  handleHistory(
    history: HolterHeartRateHistoryItem[],
    heartRate: number,
    dateStamp: number
  ) {
    history.push({
      heartRate: heartRate,
      time: dateStamp,
    });
  }
  handleException(
    exceptionActivities: HolterRecordExceptionItem[],
    heartRate: number,
    dateStamp: number,
    low?: number | null,
    high?: number | null
  ) {
    const lowWarningHeartRate = low ? low : LOW_WARNING_HEART_RATE;
    const highWrningHeartRate = high ? high : HIGH_WARNING_HEART_RATE;
    const lastActivity =
      exceptionActivities.length > 0
        ? exceptionActivities[exceptionActivities.length - 1]
        : null;

    if (heartRate <= lowWarningHeartRate) {
      if (
        !lastActivity ||
        lastActivity.type === HOLTER_EXCEPTION.HIGH ||
        dateStamp - lastActivity.startTime - lastActivity.duration >=
          2 * ONE_MINUTE_MS
      ) {
        exceptionActivities.push({
          type: HOLTER_EXCEPTION.LOW,
          startTime: dateStamp,
          duration: ONE_MINUTE_MS,
        });
      } else {
        lastActivity.duration = dateStamp - lastActivity.startTime;
      }
    }

    if (heartRate >= highWrningHeartRate) {
      if (
        !lastActivity ||
        lastActivity.type === HOLTER_EXCEPTION.LOW ||
        dateStamp - lastActivity.startTime - lastActivity.duration >=
          2 * ONE_MINUTE_MS
      ) {
        exceptionActivities.push({
          type: HOLTER_EXCEPTION.HIGH,
          startTime: dateStamp,
          duration: ONE_MINUTE_MS,
        });
      } else {
        lastActivity.duration = dateStamp - lastActivity.startTime;
      }
    }
  }
}
