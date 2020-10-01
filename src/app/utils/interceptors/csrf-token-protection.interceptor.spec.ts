import { TestBed } from '@angular/core/testing';

import { CsrfTokenProtectionInterceptor } from './csrf-token-protection.interceptor';

describe('CsrfTokenProtectionInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      CsrfTokenProtectionInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: CsrfTokenProtectionInterceptor = TestBed.inject(CsrfTokenProtectionInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
