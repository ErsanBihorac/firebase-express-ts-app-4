import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(Auth);
  router = inject(Router);

  private readonly _user$ = new BehaviorSubject<User | null>(null);
  user$ = this._user$.asObservable();

  private authReadyResolved = false;
  private resolveAuthReady!: () => void;

  authReady = new Promise<void>((resolve) => {
    //wartet bis der ein nutzer geladen ist um dann zu resolven
    this.resolveAuthReady = resolve;
  });

  constructor() {
    onAuthStateChanged(this.auth, (user: User | null) => {
      this._user$.next(user);
      if (!this.authReadyResolved) {
        this.authReadyResolved = true;
        this.resolveAuthReady();
      }
    });
  }

  get currentUser() {
    return this._user$.value;
  }

  async login(email: string, password: string) {
    const res = await signInWithEmailAndPassword(this.auth, email, password);
    if (!res) return console.log('login was unsuccessfull');
    this.router.navigate(['/']);

    return res.user;
  }

  async register(email: string, password: string) {
    const res = await createUserWithEmailAndPassword(this.auth, email, password);
    if (!res) return console.log('register was unsuccessfull');
    this.router.navigate(['/']);

    return res.user;
  }

  async signout() {
    try {
      await signOut(this.auth);
      await this.router.navigate(['/auth']);
    } catch (error) {
      console.log(error);
    }
  }
}
