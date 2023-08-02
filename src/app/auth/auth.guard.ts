import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from './auth.service';
import { Observable, map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {
  
  const authService = inject(AuthenticationService)
  const router = inject(Router)

  return authService.isAuthenticated.pipe(
    map(isAuthenticated => {
      if(isAuthenticated) {
        return true
      } else {
        router.navigate(['/login'])
        return false
      }
    })
  )


};
