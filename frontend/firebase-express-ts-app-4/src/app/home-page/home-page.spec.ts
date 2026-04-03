import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { OpinionService } from '../services/opinion-service';
import { Opinion } from '../interfaces/opinion.interface';
import { HomePage } from './home-page';
import { ActivatedRoute } from '@angular/router';

describe('HomePage', () => {
  let fixture: ComponentFixture<HomePage>; // fixture = testcontainer der Komponente, damit kann man das template rendern und DOM auslesen
  let component: HomePage; // Komponenten-Instanz, damit kann man Methoden direkt testen und Werte prüfen

  const makeOpinions = (): Opinion[] => [
    {
      author: { uid: 'u1', email: 'ersan@mail.com' },
      id: '1',
      opinion: 'Mangos are good',
      likecount: 1,
    },
    {
      author: { uid: 'u2', email: 'amra@mail.com' },
      id: '2',
      opinion: 'Oranges are good',
      likecount: 2,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // configureTestingModule erstellt die Test Umgebung
      imports: [HomePage], // HomePage wird als Standalone Komponente geladen
      providers: [
        { provide: AuthService, useValue: {} }, // ersetzt den echten AuthService als leeres objekt
        { provide: OpinionService, useValue: { getOpinions$: () => of(makeOpinions()) } },
        { provide: ActivatedRoute, useValue: { params: of({}), queryParams: of({}), url: of([]) } },
      ],
    }).compileComponents(); // compileComponents(), stellt sicher dass die Komponente und template fertig erstellt werden

    fixture = TestBed.createComponent(HomePage); // erstellt die TestUmgebung nachdem Testbed sie zuvor konfiguriert hat
    component = fixture.componentInstance; // Komponenten instanz wird verwendet um Methoden aufzurufen, properties und interne Zustände zu testen und
  });

  it('likeCurrent increments and moves to next opinion on like', () => {
    const opinions = makeOpinions();
    const previousLikecount = opinions[0].likecount;
    component.likeCurrent(opinions);

    expect(component.currentIndex).toBe(1); // aktuelle index hat sich erhöht
    expect(opinions[1].likecount).toBe(2); // likecount der nächsten opinion bleibt

    expect(opinions[0].likecount).toBe(previousLikecount + 1); //likecount vom vorherigen post hat sich erhäht
  });

  it('likeCurrent increments and moves to next opinion on dislike', () => {
    const opinions = makeOpinions();
    const previousLikecount = opinions[0].likecount;
    component.dislikeCurrent(opinions);

    expect(component.currentIndex).toBe(1); // aktuelle index hat sich erhöht
    expect(opinions[1].likecount).toBe(2); // likecount der nächsten opinion bleibt

    expect(opinions[0].likecount).toBe(previousLikecount); //likecount vom vorherigen post hat NICHT erhöht
  });

  it('Index increments on on dislike', () => {
    const opinions = makeOpinions();
    const previousIndex = component.currentIndex;
    component.dislikeCurrent(opinions);

    expect(component.currentIndex).toBe(previousIndex + 1);
  });

  it('Index increments on on like', () => {
    const opinions = makeOpinions();
    const previousIndex = component.currentIndex;
    component.likeCurrent(opinions);

    expect(component.currentIndex).toBe(previousIndex + 1);
  });

  it('returns null when opinions array is empty', () => {
    const opinions: Opinion[] = [];
    expect(component.currentOpinionFrom(opinions)).toBeNull();
  });

  it('loops back to start after last opinion', () => {
    const opinions = makeOpinions();
    component.currentIndex = opinions.length - 1;
    component.likeCurrent(opinions);
    expect(component.currentIndex).toBe(0);
  });
});
