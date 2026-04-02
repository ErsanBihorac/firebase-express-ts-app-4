export interface OpinionAuthor {
  uid: string;
  email: string;
}

export interface Opinion {
  author: OpinionAuthor;
  id?: string;
  opinion: string;
  likecount: number;
}
