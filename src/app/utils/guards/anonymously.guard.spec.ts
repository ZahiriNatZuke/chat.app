import { TestBed } from '@angular/core/testing';

import { AnonymouslyGuard } from './anonymously.guard';

describe('AnonymouslyGuard', () => {
  let guard: AnonymouslyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AnonymouslyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
