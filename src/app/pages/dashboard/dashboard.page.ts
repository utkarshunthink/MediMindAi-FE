import { DatePipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute } from '@angular/router';
import { LOCAL_STORAGE_KEYS } from 'src/app/core/constants';
import { IMAGES } from 'src/app/core/constants/images.constant';
import { TITLES } from 'src/app/core/constants/title.constant';
import { PreviousPrescription, PreviousPrescriptionData } from 'src/app/core/dtos/prescription.dto';
import { ApiService, LocalStorageService } from 'src/app/core/services';
import { ActivityGrowthChartComponent } from '../activity-growth-chart/activity-growth-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatProgressBarModule, NgIf, NgFor,MatProgressBarModule,NgStyle,ActivityGrowthChartComponent, DatePipe],
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

  constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute,
    private localStorage: LocalStorageService) {
    this.weight = 1000; // Default weight
    this.height = 199; // Default height
    this.bmiValue = 0; // Default BMI
    this.bmiStatus = ''; // Default status
    this.calculateBMI();
    this.updateBMIStatus();
  }


  public healthMetrics = [
    {
      title: "Step",
      value: 0,
      unit:"mg/dL",
      progress: 0,
      status: "Normal",
      icon: 'assets/images/icons/sugar.svg',
      bgColor: '#F8DEBD',
      minValue: 0,
      maxValue: 10000
    },
    {
      title: "calories",
      value: 0,
      unit:"Kcal",
      progress: 0,
      status: "Normal",
      icon: 'assets/images/icons/heart.svg', // Path to the image
      bgColor: '#FBF0F3', // Background color for Heart Rate
      minValue: 0, // Lower limit for heart rate
      maxValue: 10000 // Upper limit for heart rate
    },
    {
      title: "activeMinutes",
      value: 0,
      unit:'USG',
      progress: 0,
      status: "Normal",
      icon: 'assets/images/icons/blood-pressure.svg', // Path to the image
      bgColor: '#D0FBFF',
      minValue: 0, // Lower limit for blood pressure
      maxValue: 300 // Upper limit for blood pressure

    }
  ];
  public previousPrescription!: PreviousPrescriptionData;
  public googleFit: any = {};
  public isGoogleFit: boolean = false;

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
    if (min === max) {
      throw new Error('Min and max values must be different.');
    }
    if (value < min) {
      value = min;
    } else if (value > max) { value = max;}
    return ((value - min) / (max - min)) * 100;
  }

  ngOnInit(){
    this.activatedRoute.queryParams.subscribe(res=>{
      if(res['token']) this.localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, res['token']);
      this.getGoogleFit();
      // this.getPreviousPrescription();
    })
    
    
  }

  getPreviousPrescription(){
    this.apiService.getPreviousPrescription(1).then((res: PreviousPrescription)=>{
      console.log(res);
      this.previousPrescription = res.data.userPrescription[0];
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
  getGoogleFit(){
    // this.apiService.getGoogleFit('2').then((res)=>{
    //   console.log('res:', res);
    // })
    this.isGoogleFit = true;
    const res = {
      "success": true,
      "message": "Google Fit data fetched Data successfully",
      "data": [
          {
              "numberOfDays": "2",
              "fitData": [
                  {
                      "fromDate": "1726206663448",
                      "toDate": "1726293063448",
                      "step": 5509,
                      "sleep": 0,
                      "calories": 1635.7500268220904,
                      "heartRate": 0,
                      "activeMinutes": 64,
                      "activitySegment": 0
                  },
                  {
                      "fromDate": "1726293063448",
                      "toDate": "1726379463448",
                      "step": 908,
                      "sleep": 0,
                      "calories": 1533.9967016533426,
                      "heartRate": 0,
                      "activeMinutes": 137,
                      "activitySegment": 277938
                  }
              ]
          }
      ]
    }
    this.googleFit = res.data[0].fitData[res.data[0].fitData.length-1];

    this.healthMetrics[0].value = this.googleFit.step;
    this.healthMetrics[0].progress = this.googleFit.step;
    this.healthMetrics[1].value = Number(this.googleFit.calories.toFixed(2));
    this.healthMetrics[1].progress = Number(this.googleFit.calories.toFixed(2));
    this.healthMetrics[2].value = this.googleFit.activeMinutes;
    this.healthMetrics[2].progress = this.googleFit.activeMinutes;

  }

  calculateBMR(weight: number, height: number, age: number, gender: string) {
    if (gender === 'male') {
      return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else if (gender === 'female') {
      return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    } else {
      throw new Error('Invalid gender specified. Please use "male" or "female".');
    }
  }

}
