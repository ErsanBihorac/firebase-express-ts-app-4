import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePage } from './home-page';
import { AuthService } from '../services/auth-service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [{ provide: AuthService, useValue: {} }], // provide AuthService to test
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
