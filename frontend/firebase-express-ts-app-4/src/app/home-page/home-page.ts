import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Opinion } from '../interfaces/opinion.interface';
import { RouterLink } from '@angular/router';
import { OpinionService } from '../services/opinion-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  authService = inject(AuthService);
  opinionService = inject(OpinionService);
  opinions$ = this.opinionService.getOpinions$();

  currentIndex = 0;

  currentOpinionFrom(opinions: Opinion[]): Opinion | null {
    return opinions[this.currentIndex] ?? null;
  }

  likeCurrent(opinions: Opinion[]) {
    const current = this.currentOpinionFrom(opinions);
    if (!current) return;
    current.likecount += 1;
    this.nextOpinion(opinions);
  }

  dislikeCurrent(opinions: Opinion[]) {
    const current = this.currentOpinionFrom(opinions);
    if (!current) return;
    this.nextOpinion(opinions);
  }

  private nextOpinion(opinions: Opinion[]) {
    if (opinions.length === 0) return;
    if (this.currentIndex < opinions.length - 1) {
      this.currentIndex += 1;
    } else {
      this.currentIndex = 0;
    }
  }
}
