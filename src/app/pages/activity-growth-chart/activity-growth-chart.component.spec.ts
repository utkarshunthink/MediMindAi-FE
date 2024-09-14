import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityGrowthChartComponent } from './activity-growth-chart.component';

describe('ActivityGrowthChartComponent', () => {
  let component: ActivityGrowthChartComponent;
  let fixture: ComponentFixture<ActivityGrowthChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ActivityGrowthChartComponent]
    });
    fixture = TestBed.createComponent(ActivityGrowthChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
