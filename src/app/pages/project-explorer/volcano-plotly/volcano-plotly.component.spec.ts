import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolcanoPlotlyComponent } from './volcano-plotly.component';

describe('VolcanoPlotlyComponent', () => {
  let component: VolcanoPlotlyComponent;
  let fixture: ComponentFixture<VolcanoPlotlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolcanoPlotlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VolcanoPlotlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
