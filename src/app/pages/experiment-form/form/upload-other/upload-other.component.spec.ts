import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadOtherComponent } from './upload-other.component';

describe('UploadOtherComponent', () => {
  let component: UploadOtherComponent;
  let fixture: ComponentFixture<UploadOtherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadOtherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
