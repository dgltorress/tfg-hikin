import { Component, OnInit, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, InfiniteScrollCustomEvent } from '@ionic/angular';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';

import { MainheaderComponent, SearchBars } from 'src/app/layouts/mainheader/mainheader.component';
import { UsuarioprevComponent } from 'src/app/components/usuarioprev/usuarioprev.component';
import { ClubprevComponent } from 'src/app/components/clubprev/clubprev.component';
import { ClubformComponent } from 'src/app/components/clubform/clubform.component';

@Component({
  selector: 'app-comunidad',
  templateUrl: 'comunidad.page.html',
  styleUrls: ['../../commonStyle.scss','../home.page.scss','comunidad.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, MainheaderComponent, UsuarioprevComponent,
    ClubprevComponent, ClubformComponent]
})
export class ComunidadPage implements OnInit {

  public currentSegment: string = 'usuarios';

  public usuarios: any[] | null = null;
  public clubes: any[] | null = null;

  private paginaActualUsuarios: number = 0;
  private paginaActualClubes: number = 0;

  private paramsUsuarios: any = {};
  private paramsClubes: any = {};

  public isCreateOpen: boolean = false;

  public searchBars = SearchBars;

  constructor(
    private api: ApiService,
    private alertService: AlertService
  ){}

  ngOnInit(): void {
    this.getUsuarios();
    this.getClubes();
  }

  getUsuarios(): void {
    this.paramsUsuarios.p = this.paginaActualUsuarios;

    this.api.getUsuarios( {
      params: this.paramsUsuarios,
      successCallback: ( response: any ) => {
        if( this.usuarios === null ) this.usuarios = [];

        const responseBody: any = response.body;

        if( Array.isArray( responseBody.usuarios ) === true ){
          const response = responseBody.usuarios;

          for( let i = 0; i < response.length; ++i ){
            this.usuarios.push( response[ i ] );
          }

          if( response.length > 0 ){
            ++this.paginaActualUsuarios;
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

  getClubes(): void {
    this.paramsClubes.p = this.paginaActualClubes;

    this.api.getClubes( {
      params: this.paramsClubes,
      successCallback: ( response: any ) => {
        if( this.clubes === null ) this.clubes = [];

        const responseBody: any = response.body;

        if( Array.isArray( responseBody.clubes ) === true ){
          const response = responseBody.clubes;

          for( let i = 0; i < response.length; ++i ){
            this.clubes.push( response[ i ] );
          }

          if( response.length > 0 ){
            ++this.paginaActualClubes;
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

  buscarComunidad( ev: any ){
    this.usuarios = null;
    this.paginaActualUsuarios = 0;

    this.clubes = null;
    this.paginaActualClubes = 0;

    Object.keys( ev ).forEach( ( key ) => {
      const param = ev[ key ];

      if( ( param === null ) ||
          ( param === '' ) ){
        delete ev[ key ];
      }
    } );

    this.paramsUsuarios = structuredClone( ev );
    this.paramsClubes = structuredClone( ev );

    if( this.paramsUsuarios.texto ){
      this.paramsUsuarios.usuario = this.paramsUsuarios.texto;
      delete this.paramsUsuarios.texto;
    }

    this.getUsuarios();
    this.getClubes();
  }

  onIonInfinite( ev: any ) {
    switch( this.currentSegment ){
      case 'usuarios': this.getUsuarios(); break;
      case 'clubes': this.getClubes(); break;

      default:
        if( isDevMode() === true ){
          console.warn( `No se ha encontrado un segmento que coincida con "${this.currentSegment}"` )
        }
      break;
    }

    ( ev as InfiniteScrollCustomEvent ).target.complete();
  }

  redirigirNueva( id?: number ): void {
    if( id ){
      this.isCreateOpen = false;
      
      /**
       * INTENTAR REDIRIGIR DA EL SIGUIENTE ERROR:
       * 
       * El consumo de memoria will-change es demasiado alto
       * 
       * this.router.navigate( [ `/clubes/${id}` ] ); 
       * **/
    }
  }

  toggleCrear( opened: boolean ): void {
    this.isCreateOpen = opened;
  }

  setSegment( ev: any ): void {
    this.currentSegment = ev.target.value;
  }
}
