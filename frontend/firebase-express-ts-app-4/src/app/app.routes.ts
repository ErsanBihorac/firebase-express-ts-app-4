import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { guestGuard } from '../guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./home-page/home-page').then((c) => c.HomePage);
    },
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    loadComponent: () => {
      return import('./auth-page/auth-page').then((c) => c.AuthPage);
    },
    canActivate: [guestGuard],
  },
  {
    path: 'create-opinion',
    loadComponent: () => {
      return import('./create-opinion/create-opinion').then((c) => c.CreateOpinion);
    },
    canActivate: [authGuard],
  },
  {
    path: 'view-opinion',
    loadComponent: () => {
      return import('./view-opinion/view-opinion').then((c) => c.ViewOpinion);
    },
    canActivate: [authGuard],
  },
];
