import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNavComponent } from 'src/app/components';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, SideNavComponent],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {}
