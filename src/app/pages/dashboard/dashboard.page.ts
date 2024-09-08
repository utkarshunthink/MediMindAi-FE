import { Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatProgressBarModule],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  getBmiProgressBarValue() {
    const inputValue = 24.9;
    const minScaleValue = 15;
    const maxScaleValue = 40;
    const minProgressValue = 0;
    const maxProgressValue = 100;

    if (inputValue < minScaleValue) {
      return minScaleValue;
    }

    if (inputValue > maxScaleValue) {
      return maxScaleValue;
    }

    const progressValue =
      ((inputValue - minScaleValue) / (maxScaleValue - minScaleValue)) *
      (maxProgressValue - minProgressValue);
    return progressValue;
  }
}
