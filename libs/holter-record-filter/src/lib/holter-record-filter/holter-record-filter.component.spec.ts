import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HolterRecordFilterComponent } from './holter-record-filter.component';

describe('HolterRecordFilterComponent', () => {
  let component: HolterRecordFilterComponent;
  let fixture: ComponentFixture<HolterRecordFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolterRecordFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HolterRecordFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
