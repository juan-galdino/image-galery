import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../auth/auth.service';
import { Observable, map } from 'rxjs';

export const landingPageGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const authService = inject(AuthenticationService)
  const router = inject(Router)

  return authService.isAuthenticated.pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        router.navigate(['/home/galeria'])
        return false
      } else {
        return true
      }
    })
  )
};
