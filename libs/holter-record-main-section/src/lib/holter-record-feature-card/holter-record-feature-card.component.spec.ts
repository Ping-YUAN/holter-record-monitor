import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HolterRecordFeatureCardComponent } from './holter-record-feature-card.component';

describe('HolterRecordFeatureCardComponent', () => {
  let component: HolterRecordFeatureCardComponent;
  let fixture: ComponentFixture<HolterRecordFeatureCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolterRecordFeatureCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HolterRecordFeatureCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
