import { NgFor, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { IMAGES } from 'src/app/core/constants/images.constant';
import { TITLES } from 'src/app/core/constants/title.constant';
import { ApiService } from 'src/app/core/services';
import { ActivityGrowthChartComponent } from '../activity-growth-chart/activity-growth-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatProgressBarModule,NgFor,MatProgressBarModule,NgStyle,ActivityGrowthChartComponent],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  public titles = TITLES;
  public images = IMAGES;
  public weight: number;
  public height: number;
  public bmiValue: number;
  public bmiStatus: string;

  constructor(private apiService: ApiService) {
    this.weight = 1000; // Default weight
    this.height = 199; // Default height
    this.bmiValue = 0; // Default BMI
    this.bmiStatus = ''; // Default status
    this.calculateBMI();
    this.updateBMIStatus();
  }


  public healthMetrics = [
    {
      title: "Blood Sugar",
      value: "80",
      unit:"mg/dL",
      progress: 80,
      status: "Normal",
      icon: 'assets/images/icons/sugar.svg',
      bgColor: '#F8DEBD', // Background color for Blood Sugar
      minValue: 70,
      maxValue: 130 // Upper limit for blood sugar
    },
    {
      title: "Heart Rate",
      value: "98",
      unit:"bpm",
      progress: 98,
      status: "Normal",
      icon: 'assets/images/icons/heart.svg', // Path to the image
      bgColor: '#FBF0F3', // Background color for Heart Rate
      minValue: 60, // Lower limit for heart rate
      maxValue: 100 // Upper limit for heart rate
    },
    {
      title: "Hydration",
      value: "102",
      unit:'USG',
      progress: 102,
      status: "Normal",
      icon: 'assets/images/icons/blood-pressure.svg', // Path to the image
      bgColor: '#D0FBFF',
      minValue: 80, // Lower limit for blood pressure
      maxValue: 120 // Upper limit for blood pressure

    }
  ];

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

  clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  ngOnInit(){
    this.getPreviousPrescription();
  }

  getPreviousPrescription(){
    this.apiService.getPreviousPrescription(1).then(res=>{
      console.log(res);
    }).catch(err=> console.log(err));
  }

  calculateBMI() {
    if (this.height > 0) {
      this.bmiValue = this.weight / (this.height * this.height)*10000;
      this.bmiValue = parseFloat(this.bmiValue.toFixed(2)); // Format BMI to 2 decimal places
      this.updateBMIStatus();
    } else {
      this.bmiValue = 0; // Reset BMI if height is not valid
      this.bmiStatus = 'Please enter a valid height.';
    }
  }

  updateBMIStatus() {
    if (this.bmiValue < 18.5) {
      this.bmiStatus = 'You are underweight.';
    } else if (this.bmiValue >= 18.5 && this.bmiValue < 24.9) {
      this.bmiStatus = 'You are healthy.';
    } else {
      this.bmiStatus = 'You are overweight';
    }
  }

  get humanBodyImage() {
    if (this.bmiValue < 18.5) {
      return this.images.humanBodySlim; // Underweight
    } else if (this.bmiValue >= 18.5 && this.bmiValue < 24.9) {
      return this.images.humanBodyFit; // Normal weight
    } else {
      return this.images.humanBodyFat; // Overweight or Obesity
    }
  }
}
