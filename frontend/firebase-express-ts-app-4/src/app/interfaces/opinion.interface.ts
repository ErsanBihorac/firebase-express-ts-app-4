import type { FieldValue, Timestamp } from 'firebase/firestore';

export interface OpinionAuthor {
  uid: string;
  email: string;
}

export interface Opinion {
  author: OpinionAuthor;
  id?: string;
  opinion: string;
  likecount: number;
  createdAt?: Timestamp | FieldValue;
}
