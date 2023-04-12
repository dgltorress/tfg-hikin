import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user: any = null;
  public token: any = null;

  public isAdmin: boolean = false;
  public jwt?: string = '';

  public static readonly userField: string = 'usuario';
  public static readonly tokenField: string = 'token';

  constructor(){
    this.updateUserData();
    this.updateTokenData();
  }

  public updateUserData( newUser: any = null ) : void {
    const userStoredInSession: string | null = sessionStorage.getItem( UserService.userField );
    const userStoredInLocal: string | null   = localStorage.getItem( UserService.userField );

    if( newUser === null ){
      if( userStoredInSession !== null )    this.user = JSON.parse( userStoredInSession );
      else if( userStoredInLocal !== null ) this.user = JSON.parse( userStoredInLocal );
      else                                  this.user = null;
    }
    else{
      this.user = newUser;

      if( userStoredInSession !== null )    sessionStorage.setItem( UserService.userField , JSON.stringify( newUser ) );
      else if( userStoredInLocal !== null ) localStorage.setItem( UserService.userField , JSON.stringify( newUser ) );
    }

    if( this.user ){
      this.isAdmin = Boolean( this.user.isAdmin );
      this.jwt = this.token.jwt;
    }
  }

  public updateTokenData( newToken: any = null ) : void {
    const tokenStoredInSession: string | null = sessionStorage.getItem( UserService.tokenField );
    const tokenStoredInLocal: string | null   = localStorage.getItem( UserService.tokenField );

    if( newToken === null ){
      if( tokenStoredInSession !== null )    this.token = JSON.parse( tokenStoredInSession );
      else if( tokenStoredInLocal !== null ) this.token = JSON.parse( tokenStoredInLocal );
      else                                   this.token = null;
    }
    else{
      this.token = newToken;

      if( tokenStoredInSession !== null )    sessionStorage.setItem( UserService.tokenField , JSON.stringify( newToken ) );
      else if( tokenStoredInLocal !== null ) localStorage.setItem( UserService.tokenField , JSON.stringify( newToken ) );
    }

  }
}
