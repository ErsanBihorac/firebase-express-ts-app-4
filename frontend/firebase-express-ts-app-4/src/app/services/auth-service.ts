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
      if (user) {
        console.log('User signed in');
        this.router.navigate(['/']);
      } else {
        console.log('No user signed in');
        this.router.navigate(['/auth']);
      }
    });
  }

  setUser(user: User | null) {
    this._user$.next(user);
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
