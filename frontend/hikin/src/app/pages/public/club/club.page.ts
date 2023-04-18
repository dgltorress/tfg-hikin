import { Component, OnInit, Input, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, InfiniteScrollCustomEvent } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';

import { ClubheaderComponent } from 'src/app/layouts/clubheader/clubheader.component';
import { PublicacionComponent } from 'src/app/components/publicacion/publicacion.component';
import { SalidaprevComponent } from 'src/app/components/salidaprev/salidaprev.component';
import { UsuarioprevComponent } from 'src/app/components/usuarioprev/usuarioprev.component';

@Component({
  selector: 'app-hikin-club-detalles',
  templateUrl: './club.page.html',
  styleUrls: ['../commonStyle.scss','./club.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ClubheaderComponent,
    PublicacionComponent, SalidaprevComponent, UsuarioprevComponent]
})
export class ClubPage implements OnInit {

  @Input() club: any = null;

  public currentSegment: 'publicaciones' | 'salidas' | 'miembros' = 'publicaciones';

  public publicaciones: any[] = [];
  public salidas: any[] = [];
  public miembros: any[] = [];

  private paginaActualPublicaciones: number = 0;
  private paginaActualSalidas: number = 0;

  private paramsPublicaciones: any = {};
  private paramsSalidas: any = {};

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
          this.paramsPublicaciones.club = id;
          this.paramsSalidas.club = id;

          this.getClub( id );
          this.getPublicaciones();
          this.getSalidas();
          this.getMiembros( id );
        }
      }
    } );
  }

  getClub( id: number ): void {
    this.api.getClub( id , {
      successCallback: ( response: any ) => {
        this.club = response.body;
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

  getSalidas(): void {
    this.paramsSalidas.p = this.paginaActualSalidas;

    this.api.getSalidas( {
      params: this.paramsSalidas,
      successCallback: ( response: any ) => {
        const responseBody: any = response.body;

        if( Array.isArray( responseBody.salidas ) === true ){
          const response = responseBody.salidas;

          for( let i = 0; i < response.length; ++i ){
            this.salidas.push( response[ i ] );
          }

          if( response.length > 0 ){
            ++this.paginaActualSalidas;
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

  getMiembros( id: number ): void {
    this.paramsSalidas.p = this.paginaActualSalidas;

    this.api.getClubMiembros( id, {
      successCallback: ( response: any ) => {
        const responseBody: any = response.body;

        if( Array.isArray( responseBody ) === true ){
          const response = responseBody;

          for( let i = 0; i < response.length; ++i ){
            this.miembros.push( response[ i ] );
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
      case 'salidas': this.getSalidas(); break;
      case 'miembros': break;

      default:
        if( isDevMode() === true ){
          console.warn( `No se ha encontrado un segmento que coincida con "${this.currentSegment}"` )
        }
      break;
    }

    ( ev as InfiniteScrollCustomEvent ).target.complete();
  }

  setSegment( ev: any ): void {
    this.currentSegment = ev.target.value;
  }
}
