import { inject, Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(Auth);
  router = inject(Router);
  private readonly _user$ = new BehaviorSubject<User | null>(null);
  user$ = this._user$.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user: User | null) => {
      this._user$.next(user);
      if (user) {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/auth']);
      }
    });
  }

  get currentUser() {
    return this._user$.value;
  }

  async login(email: string, password: string) {
    const res = await signInWithEmailAndPassword(this.auth, email, password);
    if (!res) return console.log('login was unsuccessfull');

    return res.user;
  }

  async register(email: string, password: string) {
    const res = await createUserWithEmailAndPassword(this.auth, email, password);
    if (!res) return console.log('register was unsuccessfull');

    return res.user;
  }

  async signout() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.log(error);
    }
  }
}
