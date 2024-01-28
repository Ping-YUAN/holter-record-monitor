/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  WritableSignal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HolterDataService, HolterRecordPatient } from '@holter-service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'holter-record-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    NgxMaterialTimepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './holter-record-filter.component.html',
  styleUrl: './holter-record-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HolterRecordFilterComponent implements OnInit {
  @Input()
  patients: HolterRecordPatient[] = [];

  showTimeRange = signal(false);
  patientForm!: FormGroup;
  dateForm!: FormGroup;

  timeSlots = [
    { name: 'One Hour', value: 1 },
    { name: 'Two Hour', value: 2 },
    { name: 'Three Hour', value: 3 },
  ];

  holterFilter: WritableSignal<{
    name: string;
    start: number;
    end: number;
  }> = signal({
    name: '',
    start: 0,
    end: 0,
  });

  get hasNewData() {
    const idx = this.holterDataService
      .patientList()
      .findIndex((item) => !item.read);
    return idx > -1;
  }

  constructor(private holterDataService: HolterDataService) {}

  ngOnInit(): void {
    this.patientForm = new FormGroup({
      patient: new FormControl(),
    });
    this.dateForm = new FormGroup({
      date: new FormControl(),
      time: new FormControl('12:00'),
      duration: new FormControl(),
    });

    this.patientForm.valueChanges.subscribe((data) => {
      this.holterFilter.set({
        ...this.holterFilter(),
        name: data.patient,
      });
      this.setPatientDataByFilter();
    });
    this.dateForm.valueChanges.subscribe((data) => {
      if (data.time && data.date && data.duration) {
        const [hour, minute] = data.time.split(':');
        const start = new Date(data.date);
        start.setHours(hour);
        start.setMinutes(minute);
        const end = start.valueOf() + data.duration * 60 * 60 * 1000;
        this.holterFilter.set({
          ...this.holterFilter(),
          start: start.valueOf(),
          end: end,
        });

        this.setPatientDataByFilter();
      }
    });
  }

  switchTimeRange() {
    this.showTimeRange.set(!this.showTimeRange());
  }

  setPatientDataByFilter() {
    this.holterDataService.getUserHolterSummaryByTime(
      this.holterFilter().name,
      this.showTimeRange() ? this.holterFilter().start : 0,
      this.showTimeRange() ? this.holterFilter().end : 0
    );
  }
}
