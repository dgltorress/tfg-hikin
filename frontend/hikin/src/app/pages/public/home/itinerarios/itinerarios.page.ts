import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, InfiniteScrollCustomEvent } from '@ionic/angular';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';

import { MainheaderComponent, SearchBars } from 'src/app/layouts/mainheader/mainheader.component';
import { ItinerarioprevComponent } from 'src/app/components/itinerarioprev/itinerarioprev.component';

@Component({
  selector: 'app-itinerarios',
  templateUrl: 'itinerarios.page.html',
  styleUrls: ['../commonStyle.scss','../home.page.scss','itinerarios.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, MainheaderComponent, ItinerarioprevComponent]
})
export class ItinerariosPage implements OnInit {

  public itinerarios: any[] | null = null;
  private paginaActual: number = 0;

  private params: any = {};

  public searchBars = SearchBars;
  
  constructor(
    private api: ApiService,
    private alertService: AlertService
  ){}

  ngOnInit(): void {
    this.getItinerarios();
  }

  getItinerarios(): void {
    this.params.p = this.paginaActual;

    this.api.getItinerarios( {
      params: this.params,
      successCallback: ( response: any ) => {
        if( this.itinerarios === null ) this.itinerarios = [];

        const responseBody: any = response.body;

        if( Array.isArray( responseBody.itinerarios ) === true ){
          const response = responseBody.itinerarios;

          for( let i = 0; i < response.length; ++i ){
            this.itinerarios.push( response[ i ] );
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

  buscarItinerarios( ev: any ){
    this.itinerarios = null;
    this.paginaActual = 0;

    Object.keys( ev ).forEach( ( key ) => {
      const param = ev[ key ];

      if( ( param === null ) ||
          ( param === '' ) ){
        delete ev[ key ];
      }
    } );

    this.params = ev;

    if( this.params.desnivel ){
      this.params.desn_min = this.params.desnivel.lower;
      this.params.desn_max = this.params.desnivel.upper;

      delete this.params.desnivel;
    }
    if( this.params.distancia ){
      this.params.dist_min = this.params.distancia.lower * 1000;
      this.params.dist_max = this.params.distancia.upper * 1000;

      delete this.params.distancia;
    }
    if( this.params.tiempo ){
      this.params.tiempo_min = this.params.tiempo.lower * 60;
      this.params.tiempo_max = this.params.tiempo.upper * 60;

      delete this.params.tiempo;
    }

    if( this.params.circular === false ){
      delete this.params.circular;
    }

    this.getItinerarios();
  }

  onIonInfinite( ev: any ) {
    this.getItinerarios();

    ( ev as InfiniteScrollCustomEvent ).target.complete();
  }
}
