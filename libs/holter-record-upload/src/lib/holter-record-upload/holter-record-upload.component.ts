import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HolterUploadService } from '@holter-service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
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
  selector: 'holter-record-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
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
  templateUrl: './holter-record-upload.component.html',
  styleUrl: './holter-record-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HolterRecordUploadComponent implements OnInit {
  uploadForm!: FormGroup;
  private fileToUpload: File | null = null;

  get uploadReady(): boolean {
    return this.uploadForm.valid && this.fileToUpload != null;
  }

  get uploading() {
    return this.holterUploadService.uploading;
  }

  get uploaded() {
    return this.holterUploadService.uploaded;
  }

  constructor(private holterUploadService: HolterUploadService) {}

  ngOnInit(): void {
    this.uploadForm = new FormGroup({
      name: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      time: new FormControl('12:00', Validators.required),
    });
  }

  handleFileInput($event) {
    this.fileToUpload = $event?.target?.files.item(0);
  }

  uploadHolterRecordFile() {
    if (this.fileToUpload && this.uploadForm.valid) {
      const formData = this.uploadForm.value;
      const date = new Date(formData.date);
      const [hour, minute] = formData.time.split(':');
      date.setHours(hour);
      date.setMinutes(minute);

      this.holterUploadService.uploadHolterCSVRecord(
        this.fileToUpload,
        formData.name,
        date.valueOf()
      );
    }
  }
}
