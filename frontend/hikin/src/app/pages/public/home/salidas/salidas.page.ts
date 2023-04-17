import { Component, OnInit, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, InfiniteScrollCustomEvent } from '@ionic/angular';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';

import { MainheaderComponent, SearchBars } from 'src/app/layouts/mainheader/mainheader.component';
import { SalidaprevComponent } from 'src/app/components/salidaprev/salidaprev.component';

@Component({
  selector: 'app-salidas',
  templateUrl: 'salidas.page.html',
  styleUrls: ['../commonStyle.scss','../home.page.scss','salidas.page.scss',],
  standalone: true,
  imports: [IonicModule, CommonModule, MainheaderComponent, SalidaprevComponent]
})
export class SalidasPage implements OnInit {

  public salidas: any[] | null = null;
  private paginaActual: number = 0;

  private params: any = {};

  public searchBars: typeof SearchBars = SearchBars;

  constructor(
    private api: ApiService,
    private alertService: AlertService
  ){}

  ngOnInit(): void {
    this.getSalidas();
  }

  getSalidas(): void {
    this.params.p = this.paginaActual;

    this.api.getSalidas( {
      params: this.params,
      successCallback: ( response: any ) => {
        if( this.salidas === null ) this.salidas = [];

        const responseBody: any = response.body;

        if( Array.isArray( responseBody.salidas ) === true ){
          const response = responseBody.salidas;

          for( let i = 0; i < response.length; ++i ){
            this.salidas.push( response[ i ] );
          }

          if( response.length > 0 ){
            ++this.paginaActual;
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

  buscarSalidas( ev: any ){
    this.salidas = null;
    this.paginaActual = 0;

    Object.keys( ev ).forEach( ( key ) => {
      if( ev[ key ] === null ){
        delete ev[ key ];
      }
    } );

    this.params = ev;

    this.getSalidas();
  }

  onIonInfinite( ev: any ) {
    this.getSalidas();

    setTimeout( () => {
      ( ev as InfiniteScrollCustomEvent ).target.complete();
    }, 2000 );
  }
}
