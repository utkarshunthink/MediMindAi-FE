import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';

PlotlyModule.plotlyjs = PlotlyJS;

@Component({
  selector: 'app-activity-growth-chart',
  standalone: true,
  imports: [CommonModule,PlotlyModule],
  templateUrl: './activity-growth-chart.component.html',
  styleUrls: ['./activity-growth-chart.component.scss']
})
export class ActivityGrowthChartComponent {
  public data: any[] = [
    {
      x: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      y: [5000, 6000, 7000, 8000, 9000, 10000, 11000],
      type: 'bar',
      name: 'Exercise',
    },
    {
      x: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      y: [3000, 3500, 4000, 4500, 5000, 5500, 6000],
      type: 'bar',
      name: 'Running',
    },
    {
      x: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      y: [2000, 2500, 3000, 3500, 4000, 4500, 5000],
      type: 'bar',
      name: 'Meditation',
    }
  ];

  public layout: any = {
    title: 'Activity Growth',
    barmode: 'group',
    height: 300,
    xaxis: {
      title: 'Months',
    },
    yaxis: {
      title: 'Value',
    }
  };
}
