import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HolterDataService } from '@holter-service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { HolterRecordUploadComponent } from '@holter-record-upload';

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
    MatButtonModule,
    HolterRecordUploadComponent,
  ],
  templateUrl: './holter-record-monitor-nav.component.html',
  styleUrl: './holter-record-monitor-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HolterRecordMonitorNavComponent {
  get connected() {
    return this.holterDataService.connected;
  }
  constructor(
    private holterDataService: HolterDataService,
    private dialog: MatDialog
  ) {}

  openUploadDialog() {
    this.dialog.open(HolterRecordUploadComponent);
  }
  reconnect() {
    this.holterDataService.reconnect();
  }
}
