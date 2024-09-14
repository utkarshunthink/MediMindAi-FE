import { Component } from '@angular/core';
import { BUTTONS } from 'src/app/core/constants/buttons.constant';
import { IMAGES } from 'src/app/core/constants/images.constant';
import { TITLES } from 'src/app/core/constants/title.constant';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  public titles = TITLES;
  public images = IMAGES;
  public buttons = BUTTONS;

  updateProfile() {
    console.log('update profile');
  }
}
