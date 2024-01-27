import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'holter-record-monitor-nav',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './holter-record-monitor-nav.component.html',
  styleUrl: './holter-record-monitor-nav.component.css',
})
export class HolterRecordMonitorNavComponent {}
