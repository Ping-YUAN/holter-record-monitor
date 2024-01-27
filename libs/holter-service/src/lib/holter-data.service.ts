/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable, WritableSignal, signal } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { HolterRecordSummary } from './model';
@Injectable({
  providedIn: 'root',
})
export class HolterDataService {
  patientList: WritableSignal<any> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);

  patientSummarySubject$ = new Subject<HolterRecordSummary>();
  private subject = webSocket(`ws://localhost:8383/holter-update`);

  constructor(private httpClientService: HttpClient) {
    this.setupHolterMonitorSocket();
  }

  getUserHolterSummaryByTime(name: string, start?: Date, end?: Date) {
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
    const queryString = [start, end]
      .map((item) => item?.valueOf())
      .filter((item) => item)
      .join('&');
    if (queryString) {
      queryParam = `?${queryString}`;
    }
    this.httpClientService.get(`holter-info/${name}${queryParam}`).subscribe({
      next: (data) => {
        this.patientSummarySubject$.next(data as any);
      },
      error: () => {},
    });
  }

  setupHolterMonitorSocket() {
    this.subject.subscribe(
      (holterPatientList) => {
        const patientList = JSON.parse(JSON.stringify(holterPatientList));
        console.log(`data get ${JSON.stringify(patientList)}`);
        this.patientList.set(patientList);
      },
      (error: any) => {
        console.log(error);
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {}
    );
  }
}
