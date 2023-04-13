import { Injectable, isDevMode } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
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
  public login( data: any , remember: boolean = false ) : void {
    // Calcula la fecha en la que caducará el token y la modifica
    if( data[ UserService.tokenField ] && 
        data[ UserService.tokenField ].expires ){
      try{
        data[ UserService.tokenField ].expires = new Date( Date.now() + Number( data[ UserService.tokenField ].expires ) );
      } catch( err ){
        data[ UserService.tokenField ].expires = undefined;
        if( isDevMode() === true ) console.warn( '(AuthService) No se ha podido almacenar la fecha de caducidad del token' );
      }
    }

    if( remember === true ){
      localStorage.setItem( UserService.userField , JSON.stringify( data[ UserService.userField ] ) );
      localStorage.setItem( UserService.tokenField , JSON.stringify( data[ UserService.tokenField ] ) );
      
    } else {
      sessionStorage.setItem( UserService.userField , JSON.stringify( data[ UserService.userField ] ) );
      sessionStorage.setItem( UserService.tokenField , JSON.stringify( data[ UserService.tokenField ] ) );
    }

    this.userService.updateUserData();
    this.userService.updateTokenData();

    this.router.navigate( [ 'home' ] );
  }

  /**
   * Elimina toda la información del usuario y del token.
   */
  public logout() : void {
    localStorage.removeItem( UserService.userField );
    localStorage.removeItem( UserService.tokenField );

    sessionStorage.removeItem( UserService.userField );
    sessionStorage.removeItem( UserService.tokenField );

    this.userService.updateUserData();
    this.userService.updateTokenData();

    this.router.navigate( [ 'login' ] );
  }

  /**
   * Determina si el usuario está logueado, es decir, existen datos personales y de token.
   * 
   * @returns Si el usuario está logueado.
   */
  public isLoggedIn() : boolean {
    if( ( ( localStorage.getItem( UserService.userField ) !== null )   && ( localStorage.getItem( UserService.tokenField ) !== null ) ) ||
        ( ( sessionStorage.getItem( UserService.userField ) !== null ) && ( sessionStorage.getItem( UserService.tokenField ) !== null ) ) ){
      return true;
    } else {
      return false;
    }
  }
}
