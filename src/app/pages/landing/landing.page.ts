import { Component } from '@angular/core';
import { BUTTONS } from 'src/app/core/constants/buttons.constant';
import { PARAGRAPHS } from 'src/app/core/constants/paragraphs.constant';
import { TITLES } from 'src/app/core/constants/title.constant';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage {
  public titles = TITLES;
  public paragraphs = PARAGRAPHS;
  public buttons = BUTTONS;
}
