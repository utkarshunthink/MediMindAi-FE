import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'landing',
    loadComponent: () =>
      import('./pages/landing/landing.page').then((p) => p.LandingPage),
  },
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.page').then((p) => p.HomePage),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.page').then(
            (p) => p.DashboardPage
          ),
      },
    ],
  },
];
