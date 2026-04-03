import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth-service';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

vi.mock('@angular/fire/auth', () => {
  return {
    Auth: class {},
    onAuthStateChanged: vi.fn(),
  };
});

describe('AuthService', () => {
  let service: AuthService; // AuthService wird definiert
  beforeEach(() => {
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

  it('sets currentUser to null when no user is logged in', () => {
    expect(service.currentUser).toBeNull();
  });
});

describe('When user is logged in', () => {
  let service: AuthService;

  beforeEach(() => {
    (onAuthStateChanged as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(
      (_auth: Auth, nextOrObserver) => {
        const next = typeof nextOrObserver === 'function' ? nextOrObserver : nextOrObserver?.next;
        if (next) {
          (next as (user: unknown) => void)({ uid: '123', email: 'test@example.com' }); // Fake user
        }
        return () => {};
      },
    );

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: {} }, // Auth wird durch ein leeres Objekt ersetzt (Wir brauchen kein echtes Firebase-Auth)
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

  it('sets currentUser when user is logged in', () => {
    expect(service.currentUser).toBeTruthy();
    expect(service.currentUser?.uid).toBe('123');
  });
});
