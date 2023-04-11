import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanActivateChildFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

export class AuthGuard { // Guard de clase (deprecado)
  constructor(){}
}

export const authGuard: CanActivateFn = ( // Guard funcional
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
  const authService = inject( AuthService );
  const router = inject( Router );

  //return authService.isLoggedIn ? true : router.navigate( [ '/login' ] );

  if( authService.isLoggedIn === true ){
    return true;
  } else {
    // Vuelve al formulario de inicio de sesión     
    router.navigate( [ '/login?err=401' ] );
    return false;
  }
};

export const canActivateChild: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => authGuard( route , state );