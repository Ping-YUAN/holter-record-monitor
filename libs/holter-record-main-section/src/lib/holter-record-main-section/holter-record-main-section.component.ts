import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HolterDataService,
  HolterRecordReadableSummary,
} from '@holter-service';
import { HolterRecordFeatureCardComponent } from '../holter-record-feature-card/holter-record-feature-card.component';
import { Observable, map } from 'rxjs';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'holter-record-main-section',
  standalone: true,
  imports: [CommonModule, HolterRecordFeatureCardComponent],
  templateUrl: './holter-record-main-section.component.html',
  styleUrl: './holter-record-main-section.component.scss',
})
export class HolterRecordMainSectionComponent implements OnInit {
  patientObservable$!: Observable<HolterRecordReadableSummary>;
  constructor(private holterDataService: HolterDataService) {}
  ngOnInit(): void {
    this.patientObservable$ =
      this.holterDataService.patientSummarySubject$.pipe(
        map((data) => {
          return {
            ...data,
            minHeartRateTime: this.getReadableTime(data.minHeartRateTime),
            maxHeartRateTime: this.getReadableTime(data.maxHeartRateTime),
          } as HolterRecordReadableSummary;
        })
      );
  }

  getReadableTime(num: number): string {
    const date = new Date(num);
    return `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  }
}