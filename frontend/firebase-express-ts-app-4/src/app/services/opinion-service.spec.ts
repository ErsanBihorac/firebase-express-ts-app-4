import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth-service';

// mock crud methods from firestore
const getDocsMock = vi.fn();
const addDocMock = vi.fn();
const deleteDocMock = vi.fn();

const opinionsRefMock = { __type: 'opinionsRef' };

// Die Firestore-Funktionen werden gemockt, damit keine echte Firestore-API aufgerufen wird.
vi.mock('@angular/fire/firestore', () => ({
  Firestore: class {}, // firestore mock
  collection: vi.fn(() => ({
    // collection mock
    withConverter: vi.fn(() => opinionsRefMock), // converter mock
  })),
  getDocs: getDocsMock, // method mock
  addDoc: addDocMock, // method mock
  deleteDoc: deleteDocMock, // method mock
  doc: vi.fn((_ref, id) => ({ __docId: id })), // doc method mock
}));

describe('OpinionService', () => {
  let service: InstanceType<typeof OpinionService>;
  let OpinionService: typeof import('./opinion-service').OpinionService;

  beforeEach(async () => {
    ({ OpinionService } = await import('./opinion-service'));
    const { Firestore } = await import('@angular/fire/firestore');

    TestBed.configureTestingModule({
      providers: [
        OpinionService,
        { provide: Firestore, useValue: {} },
        { provide: AuthService, useValue: { currentUser: { uid: 'u1', email: 'ersan@mail.com' } } },
      ],
    });

    service = TestBed.inject(OpinionService);
  });

  it('createOpinion calls addDoc', async () => {
    await service.createOpinion('This is my test opinion'); // create opinion

    expect(addDocMock).toHaveBeenCalled(); // addDoc should have been called
  });

  it('getOpinions maps docs to data', async () => {
    (getDocsMock as ReturnType<typeof vi.fn>).mockResolvedValue({
      docs: [
        {
          data: () => ({
            id: '1',
            opinion: 'This is my test opinion',
            likecount: 0,
            author: { uid: 'u1', email: 'ersan@mail.com' },
          }),
        },
      ],
    });

    const result = await service.getOpinions(); // call method
    expect(result).toHaveLength(1); // result should have docRef of length 1
    expect(result[0].opinion).toBe('This is my test opinion');
    expect(result[0].author.email).toBe('ersan@mail.com');
    expect(result[0].author.uid).toBe('u1');
  });

  it('deleteOpinion calls deleteDoc with doc ref', async () => {
    await service.deleteOpinion('abc'); // delete opinion with any ID

    expect(deleteDocMock).toHaveBeenCalled(); // expect firestore method to have been called once
  });
});
