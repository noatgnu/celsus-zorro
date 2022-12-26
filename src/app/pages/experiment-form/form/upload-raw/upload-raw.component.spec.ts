import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadRawComponent } from './upload-raw.component';

describe('UploadRawComponent', () => {
  let component: UploadRawComponent;
  let fixture: ComponentFixture<UploadRawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadRawComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadRawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
