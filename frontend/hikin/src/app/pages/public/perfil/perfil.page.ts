import { Component, OnInit, Input, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, InfiniteScrollCustomEvent, IonModal } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';

import { UserheaderComponent } from 'src/app/layouts/userheader/userheader.component';
import { PublicacionComponent } from 'src/app/components/publicacion/publicacion.component';
import { SalidaprevComponent } from 'src/app/components/salidaprev/salidaprev.component';
import { ClubprevComponent } from 'src/app/components/clubprev/clubprev.component';
import { ResenaComponent } from 'src/app/components/resena/resena.component';
import { DistintivoComponent } from 'src/app/components/distintivo/distintivo.component';
import { ValoracionComponent } from 'src/app/components/valoracion/valoracion.component';

import { commonMethods } from 'src/app/components/commonMethods';

@Component({
  selector: 'app-hikin-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['../commonStyle.scss','./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, UserheaderComponent, PublicacionComponent,
    SalidaprevComponent, ClubprevComponent, ResenaComponent, DistintivoComponent,
    ValoracionComponent]
})
export class PerfilPage implements OnInit {

  @Input() usuario: any = null;

  public currentSegment: 'publicaciones' | 'salidas' | 'clubes' |
   'resenas' | 'distintivos' | 'valoraciones' = 'publicaciones';

  public publicaciones: any[] = [];
  public salidas: any[] = [];
  public clubes: any[] = [];
  public resenas: any[] = [];
  public distintivos: any[] = [];
  public valoraciones: any[] = [];

  private paginaActualPublicaciones: number = 0;

  private paramsPublicaciones: any = {};

  constructor(
    private api: ApiService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( ( params ) => {
      const idParam: string | null = params.get( 'id' );

      if( idParam !== null ){
        const id = parseInt( idParam );

        if( isNaN( id ) !== true ){
          this.paramsPublicaciones.autor = id;

          this.getUsuario( id );
          this.getPublicaciones();
          this.getSalidas( id );
          this.getClubes( id );
          this.getResenas( id );
          this.getDistintivos( id );
          this.getValoraciones( id );
        }
      }
    } );
  }

  getUsuario( id: number ): void {
    this.api.getUsuario( id , {
      successCallback: ( response: any ) => {
        this.usuario = response.body;

        switch( this.usuario.sexo ){
          case 1: this.usuario.sexolegible = 'Varón'; break;
          case 2: this.usuario.sexolegible = 'Mujer'; break;
          case 9: this.usuario.sexolegible = 'No aplicable'; break;
      
          default: this.usuario.sexolegible = 'Desconocido'; break;
        }
      
        if( this.usuario.fecha_nac ){
          try{
            const fechaNac = new Date( this.usuario.fecha_nac ).getFullYear();
            const ahora = new Date().getFullYear();
      
            this.usuario.edad = `${( ahora - fechaNac )} años`; // Edad inexacta (redondeando a años)
          } catch( err ){
            if( isDevMode() === true ){
              console.warn( 'ERROR: No se ha podido convertir la diferencia de fechas en años', err );
            }
          }
        }
      
        if( this.usuario.fecha_reg ){
          this.usuario.fecha_reg = commonMethods.fechaISOALegible( this.usuario.fecha_reg, 'es', 'long', 'short' );
        }
      },
      failedCallback: ( errorResponse: any ) => {
        this.alertService.errorToToast( errorResponse.error );
      }
    } );
  }

  getPublicaciones(): void {
    this.paramsPublicaciones.p = this.paginaActualPublicaciones;

    this.api.getPublicaciones( {
      params: this.paramsPublicaciones,
      successCallback: ( response: any ) => {
        const responseBody: any = response.body;

        if( Array.isArray( responseBody.publicaciones ) === true ){
          const response = responseBody.publicaciones;

          for( let i = 0; i < response.length; ++i ){
            this.publicaciones.push( response[ i ] );
          }

          if( response.length > 0 ){
            ++this.paginaActualPublicaciones;
          }
        } else {
          this.alertService.showToast( 'Ha habido un error. Inténtalo de nuevo más tarde.' ); // Información errónea del servidor
        }
      },
      failedCallback: ( errorResponse: any ) => {
        this.alertService.errorToToast( errorResponse.error );
      }
    } );
  }

  getSalidas( id: number ): void {
    this.api.getUsuarioSalidas( id, {
      successCallback: ( response: any ) => {
        const responseBody: any = response.body;

        if( Array.isArray( responseBody ) === true ){
          const response = responseBody;

          for( let i = 0; i < response.length; ++i ){
            this.salidas.push( response[ i ] );
          }
        } else {
          this.alertService.showToast( 'Ha habido un error. Inténtalo de nuevo más tarde.' ); // Información errónea del servidor
        }
      },
      failedCallback: ( errorResponse: any ) => {
        this.alertService.errorToToast( errorResponse.error );
      }
    } );
  }

  getClubes( id: number ): void {
    this.api.getUsuarioClubes( id, {
      successCallback: ( response: any ) => {
        const responseBody: any = response.body;

        if( Array.isArray( responseBody ) === true ){
          const response = responseBody;

          for( let i = 0; i < response.length; ++i ){
            this.clubes.push( response[ i ] );
          }
        } else {
          this.alertService.showToast( 'Ha habido un error. Inténtalo de nuevo más tarde.' ); // Información errónea del servidor
        }
      },
      failedCallback: ( errorResponse: any ) => {
        this.alertService.errorToToast( errorResponse.error );
      }
    } );
  }

  getResenas( id: number ): void {
    this.api.getUsuarioResenas( id, {
      successCallback: ( response: any ) => {
        const responseBody: any = response.body;

        if( Array.isArray( responseBody ) === true ){
          const response = responseBody;

          for( let i = 0; i < response.length; ++i ){
            this.resenas.push( response[ i ] );
          }
        } else {
          this.alertService.showToast( 'Ha habido un error. Inténtalo de nuevo más tarde.' ); // Información errónea del servidor
        }
      },
      failedCallback: ( errorResponse: any ) => {
        this.alertService.errorToToast( errorResponse.error );
      }
    } );
  }

  getDistintivos( id: number ): void {
    this.api.getUsuarioDistintivos( id, {
      successCallback: ( response: any ) => {
        const responseBody: any = response.body;

        if( Array.isArray( responseBody ) === true ){
          const response = responseBody;

          for( let i = 0; i < response.length; ++i ){
            this.distintivos.push( response[ i ] );
          }
        } else {
          this.alertService.showToast( 'Ha habido un error. Inténtalo de nuevo más tarde.' ); // Información errónea del servidor
        }
      },
      failedCallback: ( errorResponse: any ) => {
        this.alertService.errorToToast( errorResponse.error );
      }
    } );
  }

  getValoraciones( id: number ): void {
    this.api.getUsuarioValoraciones( id, {
      successCallback: ( response: any ) => {
        const responseBody: any = response.body;

        if( Array.isArray( responseBody ) === true ){
          const response = responseBody;

          for( let i = 0; i < response.length; ++i ){
            this.valoraciones.push( response[ i ] );
          }
        } else {
          this.alertService.showToast( 'Ha habido un error. Inténtalo de nuevo más tarde.' ); // Información errónea del servidor
        }
      },
      failedCallback: ( errorResponse: any ) => {
        this.alertService.errorToToast( errorResponse.error );
      }
    } );
  }

  onIonInfinite( ev: any ) {
    switch( this.currentSegment ){
      case 'publicaciones': this.getPublicaciones(); break;

      default: break;
    }

    ( ev as InfiniteScrollCustomEvent ).target.complete();
  }

  setSegment( ev: any ): void {
    this.currentSegment = ev.target.value;
  }
}
