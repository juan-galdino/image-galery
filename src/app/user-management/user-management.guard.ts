import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const userManagementGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)

  if(!Object.keys(route.queryParams).length) {
    router.navigate(['/login'])
    return false;
  }
  return true;
};
