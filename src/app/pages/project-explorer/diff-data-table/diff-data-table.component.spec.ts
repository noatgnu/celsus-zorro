import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffDataTableComponent } from './diff-data-table.component';

describe('DiffDataTableComponent', () => {
  let component: DiffDataTableComponent;
  let fixture: ComponentFixture<DiffDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiffDataTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
