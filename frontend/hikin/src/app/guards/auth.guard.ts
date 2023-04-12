import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanActivateChildFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

export class AuthGuard { // Guard de clase (deprecado)
  constructor(){}
}

/**
 * Comprueba que el usuario esté logueado. Si no lo está, lo envía al formulario de inicio de sesión.
 */
export const loggedInGuard: CanActivateFn = ( // Guard funcional
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
  const authService = inject( AuthService );
  const router = inject( Router );

  return ( authService.isLoggedIn() === true ) ? true : router.parseUrl( '/login' ) ;
};

export const loggedInGuardChild: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => loggedInGuard( route , state );


/**
 * Comprueba que el usuario NO esté logueado. Si lo está, lo envía a la página de inicio.
 */
export const loggedOutGuard: CanActivateFn = ( // Guard funcional
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
  const authService = inject( AuthService );
  const router = inject( Router );

  return ( authService.isLoggedIn() === true ) ? router.parseUrl( '/home' ) : true ;
};

export const loggedOutGuardChild: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => loggedOutGuard( route , state );