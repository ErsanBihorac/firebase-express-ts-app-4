import { FirestoreDataConverter } from '@angular/fire/firestore';
import { Opinion } from '../interfaces/opinion.interface';

export const opinionConverter: FirestoreDataConverter<Opinion> = {
  toFirestore: (opinion) => opinion,
  fromFirestore: (snap) => ({ id: snap.id, ...snap.data() }) as Opinion,
};
