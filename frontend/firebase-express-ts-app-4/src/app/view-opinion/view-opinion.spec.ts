import { describe, it, expect } from 'vitest';
import { ViewOpinion } from './view-opinion';
import { Opinion } from '../interfaces/opinion.interface';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth-service';
import { OpinionService } from '../services/opinion-service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

const makeOpinions = (): Opinion[] => [
  { id: '1', author: { uid: 'u1', email: 'a@b.com' }, opinion: 'A', likecount: 1 },
  { id: '2', author: { uid: 'u2', email: 'c@d.com' }, opinion: 'B', likecount: 2 },
];

describe('ViewOpinion', () => {
  let fixture: ComponentFixture<ViewOpinion>;
  let component: ViewOpinion;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOpinion],
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: OpinionService, useValue: { getOpinionsByUser$: () => of(makeOpinions()) } },
        { provide: ActivatedRoute, useValue: { params: of({}), queryParams: of({}), url: of([]) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewOpinion);
    component = fixture.componentInstance;
  });

  it('nextOpinion does not increment when no opinions loaded', () => {
    component.nextOpinion([]);

    expect(component.currentIndex).toBe(0);
  });

  it('nextOpinion increments index when opinions have loaded', () => {
    const opinions = makeOpinions();
    const prev = component.currentIndex;
    component.nextOpinion(opinions);

    expect(component.currentIndex).toBe(prev + 1);
  });

  it('prevOpinion does not increment when no opinions loaded', () => {
    component.prevOpinion([]);

    expect(component.currentIndex).toBe(0);
  });

  it('prevOpinion decrements index when opinions have loaded', () => {
    const opinions = makeOpinions();
    component.prevOpinion(opinions);

    expect(component.currentIndex).toBe(opinions.length - 1);
  });

  it('currentOpinionFrom returns first opinion', () => {
    const opinions = makeOpinions();
    component.currentIndex = 0;
    const currentOpinion = component.currentOpinionFrom(opinions);

    expect(currentOpinion).toBeTruthy();
    expect(currentOpinion?.author.email).toBe('a@b.com');
    expect(currentOpinion?.opinion).toBe('A');
    expect(currentOpinion?.likecount).toBe(1);
  });
});
