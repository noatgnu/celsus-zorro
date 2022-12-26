import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDifferentialAnalysisComponent } from './upload-differential-analysis.component';

describe('UploadDifferentialAnalysisComponent', () => {
  let component: UploadDifferentialAnalysisComponent;
  let fixture: ComponentFixture<UploadDifferentialAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadDifferentialAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDifferentialAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
