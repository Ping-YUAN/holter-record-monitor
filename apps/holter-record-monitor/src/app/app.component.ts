import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HolterDataService } from '@holter-service';
import { HolterRecordMonitorNavComponent } from '@holter-record-monitor-nav';
import { HolterRecordFilterComponent } from '@holter-record-filter';
import { HolterRecordMainSectionComponent } from '@holter-record-main-section';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    HolterRecordMonitorNavComponent,
    HolterRecordFilterComponent,
    HolterRecordMainSectionComponent,
  ],
  selector: 'holter-record-monitor-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'holter-record-monitor';
  get patients() {
    return this.holterDataService.patientList;
  }
  constructor(private holterDataService: HolterDataService) {}
}
