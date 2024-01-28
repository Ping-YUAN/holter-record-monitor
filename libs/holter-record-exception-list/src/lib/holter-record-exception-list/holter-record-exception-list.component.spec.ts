import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HolterRecordExceptionListComponent } from './holter-record-exception-list.component';

describe('HolterRecordExceptionListComponent', () => {
  let component: HolterRecordExceptionListComponent;
  let fixture: ComponentFixture<HolterRecordExceptionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolterRecordExceptionListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HolterRecordExceptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
