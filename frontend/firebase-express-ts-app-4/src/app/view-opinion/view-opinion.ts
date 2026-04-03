import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { RouterLink } from '@angular/router';
import { Opinion } from '../interfaces/opinion.interface';
import { OpinionService } from '../services/opinion-service';
import { AsyncPipe } from '@angular/common';
import { tap } from 'rxjs';

@Component({
  selector: 'app-view-opinion',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './view-opinion.html',
  styleUrl: './view-opinion.css',
})
export class ViewOpinion {
  authService = inject(AuthService);
  opinionService = inject(OpinionService);

  // Stream of opinions for the current user (filtered by author.uid).
  opinions$ = this.opinionService.getOpinionsByUser$().pipe(
    tap((opinions) => {
      if (opinions.length === 0) {
        this.currentIndex = 0;
        return;
      }
      if (this.currentIndex >= opinions.length) {
        this.currentIndex = opinions.length - 1;
      }
    })
  );
  currentIndex = 0;

  currentOpinionFrom(opinions: Opinion[]): Opinion | null {
    return opinions[this.currentIndex] ?? null;
  }

  prevOpinion(opinions: Opinion[]) {
    if (opinions.length === 0) return;
    this.currentIndex = this.currentIndex === 0 ? opinions.length - 1 : this.currentIndex - 1;
  }

  nextOpinion(opinions: Opinion[]) {
    if (opinions.length === 0) return;
    this.currentIndex = this.currentIndex === opinions.length - 1 ? 0 : this.currentIndex + 1;
  }

  async deleteCurrentOpinion(opinions: Opinion[]) {
    const current = this.currentOpinionFrom(opinions);
    if (!current || !current.id) return;
    await this.opinionService.deleteOpinion(current.id);
  }
}
