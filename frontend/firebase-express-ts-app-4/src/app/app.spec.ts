import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { AuthService } from './services/auth-service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: AuthService, useValue: {} }], // provide AuthService to test
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
