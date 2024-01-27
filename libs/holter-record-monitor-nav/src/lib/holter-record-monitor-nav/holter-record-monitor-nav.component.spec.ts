import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HolterRecordMonitorNavComponent } from './holter-record-monitor-nav.component';

describe('HolterRecordMonitorNavComponent', () => {
  let component: HolterRecordMonitorNavComponent;
  let fixture: ComponentFixture<HolterRecordMonitorNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolterRecordMonitorNavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HolterRecordMonitorNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
