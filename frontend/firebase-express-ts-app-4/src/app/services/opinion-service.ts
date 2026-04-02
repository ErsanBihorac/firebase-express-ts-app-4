import { inject, Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs } from '@angular/fire/firestore';
import { opinionConverter } from '../converters/opinion.converter';
import { AuthService } from './auth-service';
import { Opinion, OpinionAuthor } from '../interfaces/opinion.interface';

@Injectable({
  providedIn: 'root',
})
export class OpinionService {
  firestore = inject(Firestore);
  authService = inject(AuthService);
  opinionsRef = collection(this.firestore, 'opinions').withConverter(opinionConverter); // verwendet den Converter direkt um die daten zu mappen aus dem Firestore und beim speichern in den Firestore

  async getOpinions() {
    const snap = await getDocs(this.opinionsRef);
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
    };

    return await addDoc(this.opinionsRef, doc);
  }

  async deleteOpinion(id: string) {
    const docRef = doc(this.opinionsRef, id);
    return await deleteDoc(docRef);
  }
}
