/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  InjectionToken,
  Input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Chart from 'chart.js/auto';
import { HolterHeartRateHistoryItem } from '@holter-service';

export function chartBuilder(id: string, options): Chart.Chart {
  return new Chart.Chart(id, options);
}
export const ChartBuilderToken = new InjectionToken<typeof chartBuilder>(
  'chartBuilder'
);

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'holter-record-heart-rate-chart',
  standalone: true,
  imports: [CommonModule],
  providers: [{ provide: ChartBuilderToken, useValue: chartBuilder }],
  templateUrl: './holter-record-heart-rate-chart.component.html',
  styleUrl: './holter-record-heart-rate-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HolterRecordHeartRateChartComponent {
  chart: any = null;
  timeRange = signal('');

  private data = {
    labels: [] as any[],
    datasets: [
      {
        label: 'Heart Rate',
        data: [] as string[],
      },
    ],
  };
  @Input()
  set heartRateHistory(history: HolterHeartRateHistoryItem[]) {
    if (!this.chart) {
      this.createChart();
    }

    if (history && history.length >= 1 && this.chart) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars

      this.data.labels = history.map((item) => {
        const date = new Date(item.time);
        return `${date.getHours()}:${date.getMinutes()}`;
      });
      const startDate = new Date(history[0].time);
      const endDate = new Date(history[history.length - 1].time);
      this.timeRange.set(
        `${startDate.getFullYear()}-${
          startDate.getMonth() + 1
        }-${startDate.getDate()} to ${endDate.getFullYear()}-${
          endDate.getMonth() + 1
        }-${endDate.getDate()} `
      );
      this.data.datasets[0].data = history.map((item) =>
        item.heartRate.toFixed(0)
      );
      this.chart.update();
    }
  }

  constructor(
    @Inject(ChartBuilderToken) private buildChart: typeof chartBuilder
  ) {}

  createChart() {
    this.chart = this.buildChart('canvas', {
      type: 'line',
      data: this.data,
    });
  }
}
