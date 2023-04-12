import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router
  ){}

  public updateLoginStatus(){

  }

  /**
   * Guarda la información del usuario y del token de autenticación.
   * 
   * @param data Información. Debe tener un campo con el objeto usuario y otro con el objeto token, cuyos nombres se especifican en el servicio Usuario.
   * @param remember Si guardar sólo para la sesión actual o en local.
   */
  public login( data: any , remember: boolean = false ){
    if( remember === true ) {
      localStorage.setItem( UserService.userField , JSON.stringify( data[ UserService.userField ] ) );
      localStorage.setItem( UserService.tokenField , JSON.stringify( data[ UserService.tokenField ] ) );
      
    } else {
      sessionStorage.setItem( UserService.userField , JSON.stringify( data[ UserService.userField ] ) );
      sessionStorage.setItem( UserService.tokenField , JSON.stringify( data[ UserService.tokenField ] ) );
    }

    this.userService.updateUserData();
    this.userService.updateTokenData();

    this.setLoginStatus();

    this.router.navigate( [ 'home' ] ).then( () => {
      window.location.reload();
    } );
  }

  /**
   * Elimina toda la información del usuario y del token.
   */
  public logout(): void {
    localStorage.removeItem( UserService.userField );
    localStorage.removeItem( UserService.tokenField );

    sessionStorage.removeItem( UserService.userField );
    sessionStorage.removeItem( UserService.tokenField );

    this.userService.updateUserData();
    this.userService.updateTokenData();

    this.setLoginStatus();
  }

  /**
   * Determina si el usuario está logueado, es decir, existen datos personales y de token.
   */
  public setLoginStatus(): void {
    if( ( ( localStorage.getItem( UserService.userField ) !== null )   && ( localStorage.getItem( UserService.tokenField ) !== null ) ) ||
        ( ( sessionStorage.getItem( UserService.userField ) !== null ) && ( sessionStorage.getItem( UserService.tokenField ) !== null ) ) ){
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }
}
