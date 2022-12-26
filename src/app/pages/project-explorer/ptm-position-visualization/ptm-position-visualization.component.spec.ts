import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtmPositionVisualizationComponent } from './ptm-position-visualization.component';

describe('PtmPositionVisualizationComponent', () => {
  let component: PtmPositionVisualizationComponent;
  let fixture: ComponentFixture<PtmPositionVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PtmPositionVisualizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PtmPositionVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
