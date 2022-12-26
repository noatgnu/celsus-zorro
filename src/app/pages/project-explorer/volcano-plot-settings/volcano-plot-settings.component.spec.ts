import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolcanoPlotSettingsComponent } from './volcano-plot-settings.component';

describe('VolcanoPlotSettingsComponent', () => {
  let component: VolcanoPlotSettingsComponent;
  let fixture: ComponentFixture<VolcanoPlotSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolcanoPlotSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VolcanoPlotSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
