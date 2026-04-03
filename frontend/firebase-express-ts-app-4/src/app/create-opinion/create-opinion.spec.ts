import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOpinion } from './create-opinion';
import { AuthService } from '../services/auth-service';
import { OpinionService } from '../services/opinion-service';
import { vi } from 'vitest';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CreateOpinion', () => {
  let component: CreateOpinion;
  const opinionServiceMock = { createOpinion: vi.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // configure testing bed
      imports: [CreateOpinion],
      providers: [
        // provide providers
        { provide: AuthService, useValue: {} },
        { provide: OpinionService, useValue: { createOpinion: vi.fn() } },
        { provide: ActivatedRoute, useValue: { params: of({}), queryParams: of({}), url: of([]) } },
      ],
    }).compileComponents();

    component = TestBed.createComponent(CreateOpinion).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calls createOpinion and resets form', async () => {
    component.formModel.set({ opinion: 'Hi' });

    const preventDefault = vi.fn();
    await component.onSubmit({ preventDefault } as unknown as Event);

    expect(preventDefault).toHaveBeenCalled();
    expect(opinionServiceMock.createOpinion).toHaveBeenCalledWith('Hi');
    expect(component.form().value().opinion).toBe('');
  });
});
