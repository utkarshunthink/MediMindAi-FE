import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BUTTONS } from 'src/app/core/constants/buttons.constant';
import { IMAGES } from 'src/app/core/constants/images.constant';
import { TITLES } from 'src/app/core/constants/title.constant';
import { ApiService } from 'src/app/core/services';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public titles = TITLES;
  public images = IMAGES;
  public buttons = BUTTONS;

  profileData: any;
  updateProfileForm!: FormGroup;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.initForm();
    this.getProfileData();
  }

  initForm() {
    this.updateProfileForm = new FormGroup({
      gender: new FormControl(null, Validators.required),
      date_of_birth: new FormControl(null, Validators.required),
      height: new FormControl(null),
      weight: new FormControl(null),
      waist: new FormControl(null),
      chest: new FormControl(null),
      hips: new FormControl(null),
    })
  }

  async getProfileData() {
    const response: any = await this.apiService.getProfileData();
    if (response) {
      this.profileData = response.data;
      this.patchForm();
      console.log(this.profileData);
    }
  }

  async patchForm() {
    this.updateProfileForm.patchValue({
      ...this.profileData,
      date_of_birth:
        this.profileData.date_of_birth
          ? new Date(this.profileData.date_of_birth).toISOString()
          : null
    });
  }


  async updateProfile() {
    console.log(this.updateProfileForm.getRawValue())
    if (this.updateProfileForm.invalid) {
      return;
    }
    await this.apiService.updateProfileData({
      ...this.updateProfileForm.value,
      date_of_birth:
        this.updateProfileForm.value.date_of_birth
          ? new Date(this.updateProfileForm.value.date_of_birth).toISOString()
          : null
    });
  }
}
