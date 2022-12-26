import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsDataTableComponent } from './details-data-table.component';

describe('DetailsDataTableComponent', () => {
  let component: DetailsDataTableComponent;
  let fixture: ComponentFixture<DetailsDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsDataTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
