import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, it, expect } from 'vitest';
import { AuthService } from '../app/services/auth-service';
import { authGuard } from './auth.guard';

describe('AuthGuard', () => {
  it('allows access when user is logged in', async () => {
    const routerMock = { parseUrl: (url: string) => url };
    const authMock = {
      currentUser: { uid: 'u1', email: 'test@example.com' },
      authReady: Promise.resolve(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authMock },
      ],
    });

    const result = await TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('redirects to /auth user it not logged in', async () => {
    const routerMock = { parseUrl: (url: string) => url };
    const authMock = {
      currentUser: null,
      authReady: Promise.resolve(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authMock },
      ],
    });

    const result = await TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe('/auth');
  });
});
