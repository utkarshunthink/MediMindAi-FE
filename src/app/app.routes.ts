import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.page').then((p) => p.LandingPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((p) => p.HomePage),
      canActivate: [AuthGuard], // Apply AuthGuard here
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.page').then(
            (p) => p.DashboardPage
          ),
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('./pages/chat/chat.page').then((p) => p.ChatPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.page').then((p) => p.ProfilePage),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./pages/coming-soon/coming-soon.page').then(
            (m) => m.ComingSoonPage
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.page').then((m) => m.NotFoundPage),
  },
];
