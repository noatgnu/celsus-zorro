import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDataMultipleComponent } from './upload-data-multiple.component';

describe('UploadDataMultipleComponent', () => {
  let component: UploadDataMultipleComponent;
  let fixture: ComponentFixture<UploadDataMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadDataMultipleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDataMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
