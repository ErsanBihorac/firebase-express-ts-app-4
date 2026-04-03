import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { FirebaseApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => {
      if (!getApps().length) {
        return initializeApp(environment.firebase);
      }
      return getApps()[0];
    }),
    provideAuth(() => {
      const auth = getAuth(inject(FirebaseApp));
      if (!environment.production) {
        connectAuthEmulator(auth, 'http://localhost:9099');
      }
      return auth;
    }),
    provideFirestore(() => {
      const db = getFirestore(inject(FirebaseApp));
      if (!environment.production) {
        connectFirestoreEmulator(db, 'localhost', 8080);
      }
      return db;
    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
  ],
};
