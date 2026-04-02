import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./home-page/home-page').then((c) => c.HomePage);
    },
  },
  {
    path: 'auth',
    loadComponent: () => {
      return import('./auth-page/auth-page').then((c) => c.AuthPage);
    },
  },
];
