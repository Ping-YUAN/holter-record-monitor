import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HolterRecordMainSectionComponent } from './holter-record-main-section.component';

describe('HolterRecordMainSectionComponent', () => {
  let component: HolterRecordMainSectionComponent;
  let fixture: ComponentFixture<HolterRecordMainSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolterRecordMainSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HolterRecordMainSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
