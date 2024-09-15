import { CommonModule, DatePipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { LOCAL_STORAGE_KEYS } from 'src/app/core/constants';
import { IMAGES } from 'src/app/core/constants/images.constant';
import { TITLES } from 'src/app/core/constants/title.constant';
import { PreviousPrescription, PreviousPrescriptionData } from 'src/app/core/dtos/prescription.dto';
import { ApiService, LocalStorageService } from 'src/app/core/services';
import { ActivityGrowthChartComponent } from '../activity-growth-chart/activity-growth-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, NgIf, NgFor,MatProgressBarModule,NgStyle,ActivityGrowthChartComponent, DatePipe],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  public titles = TITLES;
  public images = IMAGES;
  public weight: number = 0;
  public height: number = 0;
  public bmiValue: number = 0;
  public bmiStatus: string = '';
  public barData: any = null;
  public healthMetrics = [
    {
      title: "Step",
      value: 0,
      unit:"Steps",
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
      title: "Active Minutes",
      value: 0,
      unit:'Mins',
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
  public userInfo: any = null;

  constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute,
    private localStorage: LocalStorageService, private router: Router) {

  }

  ngOnInit(){
    this.activatedRoute.queryParams.subscribe(res=>{
      if(res['token']) this.localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, res['token']);
      this.getGoogleFit();
      this.getPreviousPrescription();
      this.getProfile();
    })
  }

  getProfile(){
    this.apiService.getProfileData().then((res: any)=>{
      if(res && res.data){
        this.userInfo = res.data;
        this.localStorage.setItem(LOCAL_STORAGE_KEYS.USER_INFO, this.userInfo);
        this.weight = Number(Number(this.userInfo.weight).toFixed(0));
        this.height = Number(Number(this.userInfo.height).toFixed(0));
      }else {
        this.router.navigate(['/home/profile']);
      }
      this.calculateBMI();
      this.updateBMIStatus();
    })
  }


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

  getPreviousPrescription(){
    this.apiService.getPreviousPrescription().then((res: PreviousPrescription)=>{
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
    this.apiService.getGoogleFit('2').then((res: any)=>{
      this.isGoogleFit = true;
      this.googleFit = res.data[0].fitData[res.data[0].fitData.length-1];
      this.healthMetrics[0].value = this.googleFit.step;
      this.healthMetrics[0].progress = this.googleFit.step;
      this.healthMetrics[1].value = Number(this.googleFit.calories.toFixed(2));
      this.healthMetrics[1].progress = Number(this.googleFit.calories.toFixed(2));
      this.healthMetrics[2].value = this.googleFit.activeMinutes;
      this.healthMetrics[2].progress = this.googleFit.activeMinutes;

      this.genBarData(res.data[0]);
    })





  }

  genBarData(data: any){
    const xAxis: string[] = [];
    const yStpes: number[] = [];
    const yCalories: number[] = [];
    const yActiveMins: number[] = [];
    data.fitData.forEach((res: any)=> xAxis.push(moment(res.fromDate).format('DDDD')));
    data.fitData.forEach((res: any)=> yStpes.push(res.step));
    data.fitData.forEach((res: any)=> yCalories.push(res.calories));
    data.fitData.forEach((res: any)=> yActiveMins.push(res.activeMinutes));

    this.barData = [
      {
        x: xAxis,
        y: yStpes,
        type: 'bar',
        name: 'Step',
      },
      {
        x: xAxis,
        y: yCalories,
        type: 'bar',
        name: 'Calories',
      },
      {
        x: xAxis,
        y: yActiveMins,
        type: 'bar',
        name: 'Active Minutes',
      }
    ]
  }

  getStatus(metric: any){
    console.log('mettric', metric);
    const percentage = Number(this.clamp(metric.value, metric.minValue, metric.maxValue).toFixed(2));
    if(percentage<30) return 'Need to improve';
    if(percentage>30 && percentage<60) return 'Good Work';
    if(percentage>60) return 'Wooah!!';
    return percentage;
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
