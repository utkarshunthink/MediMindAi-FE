import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  @Input() data: any[] = [];

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
