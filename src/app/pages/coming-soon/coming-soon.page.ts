import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coming-soon',
  templateUrl: 'coming-soon.page.html',
  styleUrls: ['coming-soon.page.scss'],
  standalone: true,
  imports: [],
})
export class ComingSoonPage {
  constructor(private router: Router) {}

  goToHome() {
    this.router.navigateByUrl('');
  }
}
