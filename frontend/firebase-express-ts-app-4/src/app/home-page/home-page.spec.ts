import { AuthService } from '../services/auth-service';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HomePage } from './home-page';

describe('HomePage', () => {
  let fixture: ComponentFixture<HomePage>; // fixture = testcontainer der Komponente, damit kann man das template rendern und DOM auslesen
  let component: HomePage; // Komponenten-Instanz, damit kann man Methoden direkt testen und Werte prüfen

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // configureTestingModule erstellt die Test Umgebung
      imports: [HomePage], // HomePage wird als Standalone Komponente geladen
      providers: [{ provide: AuthService, useValue: {} }], // ersetzt den echten AuthService als leeres objekt, verhindert Fehler durch Firebase/Router
    }).compileComponents(); // compileComponents(), stellt sicher dass die Komponente und template fertig erstellt werden

    fixture = TestBed.createComponent(HomePage); // erstellt die TestUmgebung nachdem Testbed sie zuvor konfiguriert hat
    component = fixture.componentInstance; // Komponenten instanz wird verwendet um Methoden aufzurufen, properties und interne Zustände zu testen und
  });

  it('likeCurrent increments and moves to next opinion on like', () => {
    const previousLikecount = component.opinions[0].likecount;
    component.likeCurrent();

    expect(component.currentIndex).toBe(1); // aktuelle index hat sich erhöht
    expect(component.currentOpinion?.likecount).toBe(2); // likecount vom der nächsten opinion wird angezeigt

    expect(component.opinions[0].likecount).toBe(previousLikecount + 1); //likecount vom vorherigen post hat sich erhäht
  });

  it('likeCurrent increments and moves to next opinion on dislike', () => {
    const previousLikecount = component.opinions[0].likecount;
    component.dislikeCurrent();

    expect(component.currentIndex).toBe(1); // aktuelle index hat sich erhöht
    expect(component.currentOpinion?.likecount).toBe(2); // likecount vom der nächsten opinion wird angezeigt

    expect(component.opinions[0].likecount).toBe(previousLikecount); //likecount vom vorherigen post hat NICHT erhöht
  });

  it('Index increments on on dislike', () => {
    const previousIndex = component.currentIndex;
    component.dislikeCurrent();

    expect(component.currentIndex).toBe(previousIndex + 1);
  });

  it('Index increments on on like', () => {
    const previousIndex = component.currentIndex;
    component.likeCurrent();

    expect(component.currentIndex).toBe(previousIndex + 1);
  });

  it('returns null when opinions array is empty', () => {
    component.opinions = [];
    expect(component.currentOpinion).toBeNull();
  });

  it('loops back to start after last opinion', () => {
    component.currentIndex = component.opinions.length - 1;
    component.likeCurrent();
    expect(component.currentIndex).toBe(0);
  });
});
