import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: 'not-found.page.html',
  styleUrls: ['not-found.page.scss'],
  standalone: true,
  imports: [],
})
export class NotFoundPage {
  constructor(private router: Router) {}

  goToHome() {
    this.router.navigateByUrl('');
  }
}
