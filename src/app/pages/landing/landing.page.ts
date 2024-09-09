import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { LoginComponent } from 'src/app/components/login/login.component';
import { SignupComponent } from 'src/app/components/signup/signup.component';
import { BUTTONS } from 'src/app/core/constants/buttons.constant';
import { IMAGES } from 'src/app/core/constants/images.constant';
import { PARAGRAPHS } from 'src/app/core/constants/paragraphs.constant';
import { TITLES } from 'src/app/core/constants/title.constant';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ NgFor, NgIf, LoginComponent, SignupComponent ],
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage {
  public titles = TITLES;
  public paragraphs = PARAGRAPHS;
  public buttons = BUTTONS;
  public images = IMAGES;

  public isLogin: boolean = true;

  scrollToSection(): void{
    const ele = document.getElementById("login-section") as HTMLElement;
    ele.scrollIntoView({ behavior: "smooth" });
  }

  onLoginChange(event: any): void{
    this.isLogin = event;
  }
}
