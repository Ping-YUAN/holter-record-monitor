import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
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
  ],
  templateUrl: './holter-record-filter.component.html',
  styleUrl: './holter-record-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HolterRecordFilterComponent implements OnInit {
  @Input()
  patients: HolterRecordPatient[] = [];

  patientForm!: FormGroup;

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
      start: new FormControl(),
      end: new FormControl(),
    });

    this.patientForm.valueChanges.subscribe((data) => {
      this.setPatientDataByFilter(data.patient, data.start, data.end);
    });
  }

  setPatientDataByFilter(name: string, start: Date, end: Date) {
    this.holterDataService.getUserHolterSummaryByTime(name, start, end);
  }
}
