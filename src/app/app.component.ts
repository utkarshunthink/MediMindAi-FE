import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './components';
import { LoaderService } from './core/services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLoading = false;

  constructor(
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loaderService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
      this.cdr.detectChanges();
    });
  }
}
