import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth-service';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

vi.mock('@angular/fire/auth', () => {
  return {
    Auth: class {},
    onAuthStateChanged: vi.fn(),
  };
});

describe('AuthService', () => {
  let service: AuthService; // AuthService wird definiert
  let navigateSpy: ReturnType<typeof vi.fn>; // Spy auf navigation

  beforeEach(() => {
    navigateSpy = vi.fn();
    (onAuthStateChanged as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (_auth: Auth, nextOrObserver) => {
        const next = typeof nextOrObserver === 'function' ? nextOrObserver : nextOrObserver?.next;
        if (next) {
          (next as (user: unknown) => void)(null);
        }
        return () => {};
      },
    );

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: {} }, // Auth wird durch ein leeres Objekt ersetzt (Wir brauchen kein echtes Firebase-Auth)
        { provide: Router, useValue: { navigate: navigateSpy } }, // Router bekommt den Spy damit wir die Navigation prüfen können
      ],
    });
    service = TestBed.inject(AuthService); // Der service wird erstellt, und onAuthStateChanged registriert und es wird cb(null) ausgeführt
  });

  afterEach(() => {
    // läuft nach jedem test
    vi.restoreAllMocks(); // setzt alle Spies / Mocks auf originalzustand zurück nach jedem test
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // service sollte erstellt worden sein
  });

  it('redirects to /auth when no user is logged in', () => {
    expect(navigateSpy).toHaveBeenCalledWith(['/auth']); // der Spy sollte einmal aufgerufen worden sein mit dem parameter /auth
  });
});

describe('When user is logged in', () => {
  let service: AuthService;
  let navigateSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    navigateSpy = vi.fn();

    (onAuthStateChanged as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(
      (_auth: Auth, nextOrObserver) => {
        const next = typeof nextOrObserver === 'function' ? nextOrObserver : nextOrObserver?.next;
        if (next) {
          (next as (user: unknown) => void)({ uid: '123' }); // gibt den Fake nutzer zurück statt null (nutzer ist eingeloggt)
        }
        return () => {};
      },
    );

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: {} }, // Auth wird durch ein leeres Objekt ersetzt (Wir brauchen kein echtes Firebase-Auth)
        { provide: Router, useValue: { navigate: navigateSpy } }, // Router bekommt den Spy damit wir die Navigation prüfen können
      ],
    });
    service = TestBed.inject(AuthService); // Der service wird erstellt, und onAuthStateChanged registriert und es wird cb(null) ausgeführt
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('redirects to / when user is logged in', () => {
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
