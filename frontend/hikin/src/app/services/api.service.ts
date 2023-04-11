/**
 * API SERVICE
 */

import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ApiModule } from './api.module';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
//import { AuthGuard } from '../guards/auth.guard';
//import { UserService } from './user.service';

@Injectable( {
  providedIn: 'root'
} )

@NgModule( {
  declarations: [

  ],
  imports: [
    HttpClientModule
  ],
  providers: [
    HttpClient
  ]
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
 
  constructor(
    private httpClient: HttpClient,
    // private userService: UserService
  ) {
  }
 
  // Envía una petición al servidor
  private sendRequest( options: RequestOptions ) : void {
    // Establece las opciones de la petición
    const httpOptions: any = {
      observe: 'response'
    };

    if( options.headers ){
      httpOptions.headers = new HttpHeaders( options.headers );
    }

    if( options.params ){
      httpOptions.params = new HttpParams( {
        fromObject: options.params
      } );
    }
 
    // Construye la URL.
    const url = `${environment.apiBaseUrl}/${options.endpoint}`;

    if( isDevMode() === true ) console.log( `Enviando petición a "${url}"...` );
 
    // Envía la petición
    let observable: Observable<any>;
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
        if( options.failedCallback ){
          options.failedCallback( errorResponse );
        }
      }
    } );
  }
 
  // === ENDPOINTS ===
 
  // = USUARIOS =
 
  getUsuarios( options: RequestOptions = {} ) : void {
    options.endpoint = ApiService.endpoints.usuarios;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  createUsuario( options: RequestOptions = {} ) : void {
    options.endpoint = ApiService.endpoints.usuarios;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  getUsuario( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  updateUsuario( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}`;
    options.method = ApiService.methods.PATCH;
    this.sendRequest( options );
  }

  deleteUsuario( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  getUsuarioBasico( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/basico`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getUsuarioFeed( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/feed`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getUsuarioValoraciones( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/valoraciones`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getUsuarioSeguidores( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/seguidores`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getUsuarioSeguidos( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/seguidos`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  seguirUsuario( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/seguimiento`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  deseguirUsuario( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/seguimiento`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  getUsuarioClubes( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/clubes`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getUsuarioSalidas( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/salidas`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getUsuarioResenas( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/resenas`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getUsuarioDistintivos( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/distintivos`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  subirPfp( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/imagen`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  eliminarPfp( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.usuarios}/${id}/imagen`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }
 
  // ----------

  // = PUBLICACIONES =

  getPublicaciones( options: RequestOptions = {} ) : void {
    options.endpoint = ApiService.endpoints.publicaciones;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  createPublicacion( options: RequestOptions = {} ) : void {
    options.endpoint = ApiService.endpoints.publicaciones;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  getPublicacion( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.publicaciones}/${id}`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  eliminarPublicacion( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.publicaciones}/${id}`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  subirImagenPublicacion( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.publicaciones}/${id}/imagen`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  darKudos( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.publicaciones}/${id}/kudos`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  quitarKudos( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.publicaciones}/${id}/kudos`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  getComentarios( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.publicaciones}/${id}/comentarios`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  createComentario( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.publicaciones}/${id}/comentarios`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  deleteComentario( pubId: number, comId: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.publicaciones}/${pubId}/comentarios/${comId}`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  // ----------

  // = ITINERARIOS =

  getItinerarios( options: RequestOptions = {} ) : void {
    options.endpoint = ApiService.endpoints.itinerarios;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getItinerario( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.itinerarios}/${id}`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getItinerarioResenas( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.itinerarios}/${id}/resenas`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  subirItinerarioResenas( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.itinerarios}/${id}/resenas`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  deleteItinerarioResenas( itId: number, userId: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.itinerarios}/${itId}/resenas/${userId}`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  // ----------

  // = CLUBES =

  getClubes( options: RequestOptions = {} ) : void {
    options.endpoint = ApiService.endpoints.clubes;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  createClub( options: RequestOptions = {} ) : void {
    options.endpoint = ApiService.endpoints.clubes;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  getClub( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.clubes}/${id}`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  updateClub( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.clubes}/${id}`;
    options.method = ApiService.methods.PATCH;
    this.sendRequest( options );
  }

  deleteClub( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.clubes}/${id}`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  subirImagenClub( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.clubes}/${id}/imagen`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  eliminarImagenClub( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.clubes}/${id}/imagen`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  inscribirseClub( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.clubes}/${id}/inscripcion`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  desinscribirseClub( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.clubes}/${id}/inscripcion`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  invitarClub( clubId: number, userId: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.clubes}/${clubId}/invitacion/${userId}`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  desinvitarClub( clubId: number, userId: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.clubes}/${clubId}/invitacion/${userId}`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  // ----------

  // = SALIDAS =

  getSalidas( options: RequestOptions = {} ) : void {
    options.endpoint = ApiService.endpoints.salidas;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  createSalida( options: RequestOptions = {} ) : void {
    options.endpoint = ApiService.endpoints.salidas;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  getSalida( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.salidas}/${id}`;
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  updateSalida( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.salidas}/${id}`;
    options.method = ApiService.methods.PATCH;
    this.sendRequest( options );
  }

  deleteSalida( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.salidas}/${id}`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  inscribirseSalida( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.salidas}/${id}/inscripcion`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  desinscribirseSalida( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.salidas}/${id}/inscripcion`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  valorarSalida( id: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.salidas}/${id}/valoraciones`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  invitarSalida( salId: number, userId: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.salidas}/${salId}/invitacion/${userId}`;
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  desinvitarSalida( salId: number, userId: number, options: RequestOptions = {} ) : void {
    options.endpoint = `${ApiService.endpoints.salidas}/${salId}/invitacion/${userId}`;
    options.method = ApiService.methods.DELETE;
    this.sendRequest( options );
  }

  // ----------

  // = INFO =

  getLocalidades( options: RequestOptions = {} ) : void {
    options.endpoint = 'localidades';
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getAutonomias( options: RequestOptions = {} ) : void {
    options.endpoint = 'autonomias';
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  getProvincias( options: RequestOptions = {} ) : void {
    options.endpoint = 'provincias';
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  // ----------



  // = OTROS =

  ping( options: RequestOptions = {} ) {
    options.endpoint = 'ping';
    options.method = ApiService.methods.GET;
    this.sendRequest( options );
  }

  auth( options: RequestOptions = {} ) {
    options.endpoint = 'auth';
    options.method = ApiService.methods.POST;
    this.sendRequest( options );
  }

  // ----------

  // ------------------
}
 
export interface RequestOptions {
  endpoint?: string,
  method?: string,
  params?: any,
  headers?: any,
  body?: any,
  successCallback?: any,
  failedCallback?: any,
  request?: Request
}