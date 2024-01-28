/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable, WritableSignal, signal } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import {
  HolterHeartRateHistoryItem,
  HolterRecordExceptionItem,
  HolterRecordSummary,
} from './model';
@Injectable({
  providedIn: 'root',
})
export class HolterDataService {
  connected: WritableSignal<boolean> = signal(false);
  patientList: WritableSignal<any> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);
  exceptionList: WritableSignal<HolterRecordExceptionItem[]> = signal([]);
  heartRateHistory: WritableSignal<HolterHeartRateHistoryItem[]> = signal([]);

  patientSummarySubject$ = new Subject<HolterRecordSummary>();
  private subject = webSocket(`ws://localhost:8383/holter-update`);

  constructor(private httpClientService: HttpClient) {
    this.setupHolterMonitorSocket();
  }

  getUserHolterSummaryByTime(name: string, start?: number, end?: number) {
    if (!name) {
      this.patientSummarySubject$.next({
        patientName: '',
        id: '',
        read: false,
        avgHeartRate: 0,
        minHeartRate: 0,
        maxHeartRate: 0,
        minHeartRateTime: 0,
        maxHeartRateTime: 0,
      });
      return;
    }
    let queryParam = '';

    if (start && end) {
      queryParam = `?start=${start}&end=${end}`;
    }

    this.httpClientService.get(`holter-info/${name}${queryParam}`).subscribe({
      next: (data) => {
        this.patientSummarySubject$.next(data as any);
        const exceptions = (data as any).exceptionActivities
          .map((item) => {
            return {
              ...item,
              startTime: new Date(item.startTime).toLocaleString(),
              duration: (item.duration / (60 * 1000)).toFixed(0),
            };
          })
          .filter((item) => item.duration > 1);
        this.exceptionList.set(exceptions);
        const history = (data as any).heartRateHistory
          .filter((item) => item)
          .map((item) => {
            return {
              time: new Date(item.time).toLocaleString(),
              heartRate: item.heartRate,
            };
          });
        this.heartRateHistory.set(history);
      },
      error: () => {},
    });
  }

  reconnect() {
    this.setupHolterMonitorSocket();
  }

  setupHolterMonitorSocket() {
    this.subject.subscribe(
      (holterPatientList) => {
        const patientList = JSON.parse(JSON.stringify(holterPatientList));
        this.patientList.set(patientList);
        this.connected.set(true);
      },
      (error: any) => {
        console.log(error);
        this.connected.set(false);
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {}
    );
  }
}
