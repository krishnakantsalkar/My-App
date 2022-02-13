import { TestBed } from '@angular/core/testing';

import { LoginPageGuardGuard } from './login-page-guard.guard';

describe('LoginPageGuardGuard', () => {
  let guard: LoginPageGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoginPageGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
