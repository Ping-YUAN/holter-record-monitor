/* eslint-disable @typescript-eslint/no-explicit-any */

import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HolterUploadService {
  uploading = signal(false);
  uploaded = signal(false);
  constructor(private httpClient: HttpClient) {}

  uploadHolterCSVRecord(file: File, name: string, startTime: number) {
    this.uploading.set(true);
    this.uploaded.set(false);
    const body: FormData = new FormData();
    body.append('csvFile', file, file.name);
    body.append('startTime', startTime.toString());
    body.append('name', name);
    this.httpClient.post('holter-record-upload', body).subscribe({
      next: (res) => {
        console.log(res);
        this.uploading.set(false);
        this.uploaded.set(true);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
