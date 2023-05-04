/**
 * API SERVICE
 */

import { HttpClient, HttpHeaders, HttpParams,
  HttpResponse, HttpErrorResponse, HttpContext } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { AlertService } from './alert.service';

@Injectable( {
  providedIn: 'root'
} )

export class ApiService {
 
  // ======== VARIABLES =========
 
  // Endpoints comunes
  public static readonly endpoints = {
    usuarios: 'usuarios',
    publicaciones: 'publicaciones',
    itinerarios: 'itinerarios',
    clubes: 'clubes',
    salidas: 'salidas',
    info: 'info'
  }
 
  // Métodos HTTP
  public static readonly methods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
  }

  // Nombres fijos
  public static readonly authHeaderName: string = 'Authorization';
  public static readonly bearerTokenPrefix: string = 'Bearer ';

  // Timeout en milisegundos
  public static readonly timeoutMilliseconds: number = 10000;

  // Ruta de la API
  public static readonly apiBaseUrlCookieName: string = 'apiBaseUrl';
  public static readonly defaultApiBaseUrl: string = 'http://localhost:3000/api';

  private apiBaseUrl: string;
 
  constructor(
    private httpClient: HttpClient,
    private userService: UserService,
    private authService: AuthService,
    private alertService: AlertService
  ){
    const apiBaseUrlCookie: string | null = localStorage.getItem( ApiService.apiBaseUrlCookieName );
    this.apiBaseUrl = ( apiBaseUrlCookie !== null ) ? apiBaseUrlCookie : ApiService.defaultApiBaseUrl;
  }

  /**
   * Devuelve la URL de la API
   */
   public getApiBaseUrl(): string {
    return this.apiBaseUrl;
  }

  /**
   * Establece una nueva URL para la API
   */
  public setApiBaseUrl( newApiBaseUrl: string ): void {
    this.apiBaseUrl = newApiBaseUrl;
    localStorage.setItem( ApiService.apiBaseUrlCookieName, this.apiBaseUrl );
  }

  /**
   * Reestablece una nueva URL para la API
   */
  public resetApiBaseUrl(): void {
    this.apiBaseUrl = ApiService.defaultApiBaseUrl;
    localStorage.removeItem( ApiService.apiBaseUrlCookieName );
  }
 
  /**
   * Envía una petición al servidor.
   * 
   * @param options Opciones de la petición.
   * @param includeAuth Si incluir el JWT del usuario en la cabecera como bearer token.
   */
  private sendRequest( options: TRequestOptions, includeAuth: boolean = true ) : void {
    // Establece las opciones de la petición
    const httpOptions: THttpOptions = {
      observe: 'response',
      responseType: 'json'
    };

    if( options.headers ){
      httpOptions.headers = new HttpHeaders( options.headers );
    }

    if( options.params ){
      httpOptions.params = new HttpParams( {
        fromObject: options.params
      } );
    }

    if( includeAuth === true ){
      const bearerToken: string = `${ApiService.bearerTokenPrefix}${this.userService.jwt}`;

      if( httpOptions.headers ){
        (httpOptions.headers as HttpHeaders).append( ApiService.authHeaderName, bearerToken );
      } else {
        httpOptions.headers = new HttpHeaders( {
          [ ApiService.authHeaderName ]: bearerToken
        } );
      }
    }
 
    // Construye la URL.
    const url = `${this.apiBaseUrl}/${options.endpoint}`;

    if( isDevMode() === true ) console.log( `[ApiService] ${options.method} ${url}` );
 
    // Envía la petición
    let observable: Observable<HttpResponse<Object>>;
    switch (options.method) {
      case ApiService.methods.GET:    observable = this.httpClient.get(    url ,                httpOptions ); break;
      case ApiService.methods.POST:   observable = this.httpClient.post(   url , options.body , httpOptions ); break;
      case ApiService.methods.PUT:    observable = this.httpClient.put(    url , options.body , httpOptions ); break;
      case ApiService.methods.PATCH:  observable = this.httpClient.patch(  url , options.body , httpOptions ); break;
      case ApiService.methods.DELETE: observable = this.httpClient.delete( url ,                httpOptions ); break;
 
      default: observable = this.httpClient.get( url , httpOptions ); break;
    }
 
    // Espera a la respuesta y la devuelve
    observable.subscribe( {
      next: ( response: HttpResponse<Object> ) => {
        if( options.successCallback ){
          options.successCallback( response );
        }
      },
      error: ( errorResponse: HttpErrorResponse ) => {
        // ! NO FUNCIONAN LOS TOASTS SI SE LLAMAN DESDE UN SERVICIO
        if( errorResponse.status === 401 ){ // Token no válido: se elimina y se devuelve al usuario a la página de login
          this.authService.logout();
        } else if( errorResponse.status >= 500 ){ // Error del servidor: se notifica
          this.alertService.showToast( 'Ha habido un error' );
        }

        if( options.failedCallback ){
          options.failedCallback( errorResponse );
        }
      }
    } );
  }
 
  // === ENDPOINTS PREDEFINIDOS ===
 
  // = USUARIOS =
 
  getUsuarios( options: TRequestOptions = {} ) : void {
    options.endpoint = ApiService.endpoints.usuarios;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  createUsuario( options: TRequestOptions = {} ) : void {
    options.endpoint = ApiService.endpoints.usuarios;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  getUsuario( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  updateUsuario( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}`;
    options.method = ApiService.methods.PATCH;
    this.sendRequest( options );
  }

  deleteUsuario( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  getUsuarioBasico( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/basico`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getUsuarioFeed( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/feed`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getUsuarioValoraciones( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/valoraciones`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getUsuarioSeguidores( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/seguidores`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getUsuarioSeguidos( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/seguidos`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  seguirUsuario( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/seguimiento`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  deseguirUsuario( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/seguimiento`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  getUsuarioClubes( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/clubes`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getUsuarioSalidas( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/salidas`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getUsuarioResenas( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/resenas`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getUsuarioDistintivos( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/distintivos`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  subirPfp( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/imagen`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  eliminarPfp( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/imagen`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }
 
  // ----------

  // = PUBLICACIONES =

  getPublicaciones( options: TRequestOptions = {} ) : void {
    options.endpoint = ApiService.endpoints.publicaciones;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  createPublicacion( options: TRequestOptions = {} ) : void {
    options.endpoint = ApiService.endpoints.publicaciones;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  getPublicacion( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.publicaciones}/${id}`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  eliminarPublicacion( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.publicaciones}/${id}`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  subirImagenPublicacion( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.publicaciones}/${id}/imagen`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  darKudos( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.publicaciones}/${id}/kudos`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  quitarKudos( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.publicaciones}/${id}/kudos`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  getComentarios( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.publicaciones}/${id}/comentarios`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  createComentario( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.publicaciones}/${id}/comentarios`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  deleteComentario( pubId: number, comId: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.publicaciones}/${pubId}/comentarios/${comId}`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  // ----------

  // = ITINERARIOS =

  getItinerarios( options: TRequestOptions = {} ) : void {
    options.endpoint = ApiService.endpoints.itinerarios;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getItinerario( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.itinerarios}/${id}`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getItinerarioResenas( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.itinerarios}/${id}/resenas`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  subirItinerarioResenas( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.itinerarios}/${id}/resenas`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  deleteItinerarioResenas( itId: number, userId: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.itinerarios}/${itId}/resenas/${userId}`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  // ----------

  // = CLUBES =

  getClubes( options: TRequestOptions = {} ) : void {
    options.endpoint = ApiService.endpoints.clubes;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  createClub( options: TRequestOptions = {} ) : void {
    options.endpoint = ApiService.endpoints.clubes;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  getClub( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.clubes}/${id}`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  updateClub( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.clubes}/${id}`;
    options.method = ApiService.methods.PATCH;
    this.sendRequest( options );
  }

  deleteClub( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.clubes}/${id}`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  getClubMiembros( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.clubes}/${id}/miembros`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  subirImagenClub( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.clubes}/${id}/imagen`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  eliminarImagenClub( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.clubes}/${id}/imagen`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  inscribirseClub( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.clubes}/${id}/inscripcion`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  desinscribirseClub( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.clubes}/${id}/inscripcion`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  invitarClub( clubId: number, userId: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.clubes}/${clubId}/invitacion/${userId}`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  desinvitarClub( clubId: number, userId: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.clubes}/${clubId}/invitacion/${userId}`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  // ----------

  // = SALIDAS =

  getSalidas( options: TRequestOptions = {} ) : void {
    options.endpoint = ApiService.endpoints.salidas;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  createSalida( options: TRequestOptions = {} ) : void {
    options.endpoint = ApiService.endpoints.salidas;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  getSalida( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.salidas}/${id}`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  updateSalida( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.salidas}/${id}`;
    options.method = ApiService.methods.PATCH;
    this.sendRequest( options );
  }

  deleteSalida( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.salidas}/${id}`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  getSalidaParticipantes( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.salidas}/${id}/participantes`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  inscribirseSalida( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.salidas}/${id}/inscripcion`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  desinscribirseSalida( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.salidas}/${id}/inscripcion`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  valorarSalida( id: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.salidas}/${id}/valoraciones`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  invitarSalida( salId: number, userId: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.salidas}/${salId}/invitacion/${userId}`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  desinvitarSalida( salId: number, userId: number, options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.salidas}/${salId}/invitacion/${userId}`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  // ----------

  // = INFO =

  getLocalidades( options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.info}/localidades`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getAutonomias( options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.info}/autonomias`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getProvincias( options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.info}/provincias`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getDistintivos( options: TRequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.info}/distintivos`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  // ----------



  // = OTROS =

  ping( options: TRequestOptions = {} ) {
    options.endpoint = 'ping';
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  auth( options: TRequestOptions = {} ) {
    options.endpoint = 'auth';
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  // ----------

  // ------------------
}

// Plantilla de opciones para recibir respuestas HTTP completas en JSON
export interface THttpOptions {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe: 'response';
  context?: HttpContext;
  params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

// Parámetros para el envío de peticiones
export interface TRequestOptions {
  endpoint?: string,
  method?: string,
  params?: {
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  },
  headers?: {
    [header: string]: string | string[];
  },
  body?: any,
  successCallback?: ( response: HttpResponse<Object> ) => void,
  failedCallback?: ( errorResponse: HttpErrorResponse ) => void
}