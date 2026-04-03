import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { opinionConverter } from '../converters/opinion.converter';
import { AuthService } from './auth-service';
import { Opinion, OpinionAuthor } from '../interfaces/opinion.interface';
import { serverTimestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class OpinionService {
  firestore = inject(Firestore);
  authService = inject(AuthService);
  opinionsRef = collection(this.firestore, 'opinions').withConverter(opinionConverter); // verwendet den Converter direkt um die daten zu mappen aus dem Firestore und beim speichern in den Firestore

  getOpinions$(): Observable<Opinion[]> {
    // Live stream of all opinions; stays updated in real-time.
    const q = query(this.opinionsRef, orderBy('createdAt', 'asc'));
    return collectionData(q) as Observable<Opinion[]>;
  }

  getOpinionsByUser$(): Observable<Opinion[]> {
    // Live stream filtered to the currently authenticated user.
    return this.authService.user$.pipe(
      switchMap((user) => {
        if (!user) return of([]);
        const filter = where('author.uid', '==', user.uid);
        const q = query(this.opinionsRef, filter, orderBy('createdAt', 'asc'));
        return collectionData(q) as Observable<Opinion[]>;
      })
    );
  }

  async getOpinions() {
    const q = query(this.opinionsRef, orderBy('createdAt', 'asc'));
    const snap = await getDocs(q);
    console.log('opinions count', snap.size);
    return snap.docs.map((doc) => doc.data());
  }

  async createOpinion(opinion: string) {
    const user = this.authService.currentUser;

    if (!user || !user.email) throw new Error('No current user logged in');
    const author: OpinionAuthor = {
      uid: user.uid,
      email: user.email,
    };

    if (!opinion.trim()) throw new Error('No opinion given');
    const doc: Opinion = {
      author: author,
      opinion: opinion,
      likecount: 0,
      createdAt: serverTimestamp(),
    };

    const res = await addDoc(this.opinionsRef, doc);
    if (res) console.log('created opinion successfully');

    return res;
  }

  async deleteOpinion(id: string) {
    const docRef = doc(this.opinionsRef, id);
    return await deleteDoc(docRef);
  }

  async getOpinionsByUser() {
    const user = this.authService.currentUser;
    if (!user || !user.email) throw new Error('No current user logged in');

    const filter = where('author.uid', '==', user.uid);
    const q = query(this.opinionsRef, filter, orderBy('createdAt', 'asc'));
    const snap = await getDocs(q);
    console.log('opinions count', snap.size);
    return snap.docs.map((doc) => doc.data());
  }
}
