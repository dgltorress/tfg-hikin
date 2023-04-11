import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public user: any = null;
  public token: any = null;

  public isAdmin: boolean = false;

  public static readonly usuarioField: string = 'usuario';
  public static readonly tokenField: string = 'token';

  constructor(){
    this.updateUserData();
    this.updateTokenData();
  }

  public updateUserData( newUser: any = null ) : void {
    const userStoredInSession: string | null = sessionStorage.getItem( UsuarioService.usuarioField );
    const userStoredInLocal: string | null   = localStorage.getItem( UsuarioService.usuarioField );

    if( newUser === null ){
      if( userStoredInSession !== null )    this.user = JSON.parse( userStoredInSession );
      else if( userStoredInLocal !== null ) this.user = JSON.parse( userStoredInLocal );
      else                                  this.user = null;
    }
    else{
      this.user = newUser;

      if( userStoredInSession !== null )    sessionStorage.setItem( UsuarioService.usuarioField , JSON.stringify( newUser ) );
      else if( userStoredInLocal !== null ) localStorage.setItem( UsuarioService.usuarioField , JSON.stringify( newUser ) );
    }

    if( this.user ){
      this.isAdmin = Boolean( this.user.isAdmin );
    }
  }

  public updateTokenData( newToken: any = null ) : void {
    const tokenStoredInSession: string | null = sessionStorage.getItem( UsuarioService.tokenField );
    const tokenStoredInLocal: string | null   = localStorage.getItem( UsuarioService.tokenField );

    if( newToken === null ){
      if( tokenStoredInSession !== null )    this.token = JSON.parse( tokenStoredInSession );
      else if( tokenStoredInLocal !== null ) this.token = JSON.parse( tokenStoredInLocal );
      else                                   this.token = null;
    }
    else{
      this.token = newToken;

      if( tokenStoredInSession !== null )    sessionStorage.setItem( UsuarioService.tokenField , JSON.stringify( newToken ) );
      else if( tokenStoredInLocal !== null ) localStorage.setItem( UsuarioService.tokenField , JSON.stringify( newToken ) );
    }

  }
}
