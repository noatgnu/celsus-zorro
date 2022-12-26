import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicExperimentInfoComponent } from './basic-experiment-info.component';

describe('BasicExperimentInfoComponent', () => {
  let component: BasicExperimentInfoComponent;
  let fixture: ComponentFixture<BasicExperimentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicExperimentInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicExperimentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
