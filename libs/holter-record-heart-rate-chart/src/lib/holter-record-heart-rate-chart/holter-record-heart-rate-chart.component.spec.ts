import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HolterRecordHeartRateChartComponent } from './holter-record-heart-rate-chart.component';

describe('HolterRecordHeartRateChartComponent', () => {
  let component: HolterRecordHeartRateChartComponent;
  let fixture: ComponentFixture<HolterRecordHeartRateChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolterRecordHeartRateChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HolterRecordHeartRateChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
