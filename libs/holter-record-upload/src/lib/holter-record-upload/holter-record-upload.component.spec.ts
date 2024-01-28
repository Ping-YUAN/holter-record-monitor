import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HolterRecordUploadComponent } from './holter-record-upload.component';

describe('HolterRecordUploadComponent', () => {
  let component: HolterRecordUploadComponent;
  let fixture: ComponentFixture<HolterRecordUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolterRecordUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HolterRecordUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
