import { TestBed, async, inject } from '@angular/core/testing';

import { RedirectLoggedInGuard } from './redirect-logged-in.guard';

describe('RedirectLoggedInGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedirectLoggedInGuard]
    });
  });

  it('should ...', inject([RedirectLoggedInGuard], (guard: RedirectLoggedInGuard) => {
    expect(guard).toBeTruthy();
  }));
});
