import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing/landing.page';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.page').then((p) => p.LandingPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((p) => p.HomePage),
    children: [
      { 
        path: '', 
        loadComponent: () => import('./pages/dashboard/dashboard.page').then((p) => p.DashboardPage)
      },
    ],
  },
  { path: 'landing', component: LandingPage },
  { path: '**', component: LandingPage }
];
