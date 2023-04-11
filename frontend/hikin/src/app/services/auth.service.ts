import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
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
      localStorage.setItem( UsuarioService.usuarioField , JSON.stringify( data[ UsuarioService.usuarioField ] ) );
      localStorage.setItem( UsuarioService.tokenField , JSON.stringify( data[ UsuarioService.tokenField ] ) );
      
    } else {
      sessionStorage.setItem( UsuarioService.usuarioField , JSON.stringify( data[ UsuarioService.usuarioField ] ) );
      sessionStorage.setItem( UsuarioService.tokenField , JSON.stringify( data[ UsuarioService.tokenField ] ) );
    }

    this.usuarioService.updateUserData();
    this.usuarioService.updateTokenData();

    this.setLoginStatus();

    this.router.navigate( [ 'home' ] ).then( () => {
      window.location.reload();
    } );
  }

  /**
   * Elimina toda la información del usuario y del token.
   */
  public logout(): void {
    localStorage.removeItem( UsuarioService.usuarioField );
    localStorage.removeItem( UsuarioService.tokenField );

    sessionStorage.removeItem( UsuarioService.usuarioField );
    sessionStorage.removeItem( UsuarioService.tokenField );

    this.usuarioService.updateUserData();
    this.usuarioService.updateTokenData();

    this.setLoginStatus();
  }

  /**
   * Determina si el usuario está logueado, es decir, existen datos personales y de token.
   */
  public setLoginStatus(): void {
    if( ( ( localStorage.getItem( UsuarioService.usuarioField ) !== null )   && ( localStorage.getItem( UsuarioService.tokenField ) !== null ) ) ||
        ( ( sessionStorage.getItem( UsuarioService.usuarioField ) !== null ) && ( sessionStorage.getItem( UsuarioService.tokenField ) !== null ) ) ){
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }
}
