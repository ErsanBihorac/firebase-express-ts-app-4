import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../app/services/auth-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.authReady;
  return auth.currentUser ? true : router.parseUrl('/auth');
};
