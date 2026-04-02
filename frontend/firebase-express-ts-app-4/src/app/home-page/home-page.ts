import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Opinion } from '../interfaces/opinion.interface';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  authService = inject(AuthService);
  opinions = <Opinion[]>[
    {
      author: { uid: '1a', email: 'ersan@mail.com' },
      id: '1',
      opinion: 'Mangos are good',
      likecount: 1,
    },
    {
      author: { uid: '1b', email: 'amra@mail.com' },
      id: '2',
      opinion: 'Oranges are good',
      likecount: 2,
    },
    {
      author: { uid: '1c', email: 'irina@mail.com' },
      id: '3',
      opinion: 'Pineapples are good',
      likecount: 3,
    },
  ];

  currentIndex = 0;

  get currentOpinion(): Opinion | null {
    return this.opinions[this.currentIndex] ?? null;
  }

  likeCurrent() {
    const current = this.currentOpinion;
    if (!current) return;
    current.likecount += 1;
    this.nextOpinion();
  }

  dislikeCurrent() {
    const current = this.currentOpinion;
    if (!current) return;
    this.nextOpinion();
  }

  private nextOpinion() {
    if (this.currentIndex < this.opinions.length - 1) {
      this.currentIndex += 1;
    } else {
      this.currentIndex = 0;
    }
  }
}
