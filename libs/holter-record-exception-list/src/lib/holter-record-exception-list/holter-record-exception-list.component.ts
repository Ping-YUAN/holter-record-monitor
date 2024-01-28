import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HOLTER_HEART_RATE_EXCEPTION,
  HolterRecordExceptionItem,
} from '@holter-service';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'holter-record-exception-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './holter-record-exception-list.component.html',
  styleUrl: './holter-record-exception-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HolterRecordExceptionListComponent {
  // exceptions
  exceptionTypes = [
    {
      name: 'All',
      value: '',
    },
    {
      name: HOLTER_HEART_RATE_EXCEPTION.LOW,
      value: HOLTER_HEART_RATE_EXCEPTION.LOW,
    },
    {
      name: HOLTER_HEART_RATE_EXCEPTION.HIGH,
      value: HOLTER_HEART_RATE_EXCEPTION.HIGH,
    },
  ];

  exceptionTypeForm: FormControl = new FormControl();

  private _exceptions: HolterRecordExceptionItem[] = [];
  @Input()
  set exceptions(exceptions) {
    this._exceptions = exceptions;
  }
  get exceptions() {
    return this._exceptions.filter(
      (item) =>
        !this.exceptionTypeForm.value ||
        item.type === this.exceptionTypeForm.value
    );
  }
}
