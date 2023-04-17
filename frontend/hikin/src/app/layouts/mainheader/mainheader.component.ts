import { Component, OnInit, Input, Output, EventEmitter, ViewChild, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms'
import { IonicModule, IonAccordionGroup  } from '@ionic/angular';
import { RangeValue } from '@ionic/core';

import { ApiService, TRequestOptions } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-hikin-mainheader',
  templateUrl: './mainheader.component.html',
  styleUrls: ['./mainheader.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class MainheaderComponent implements OnInit {

  // Tipo de barra de búsqueda (si hay)
  @Input() search?: number;

  // Parámetros de búsqueda
  @Output() paramsSalidas = new EventEmitter<any>();
  @Output() paramsComunidad = new EventEmitter<any>();
  @Output() paramsItinerarios = new EventEmitter<any>();

  // Acordeones
  @ViewChild( 'acordeonSalidas' ) acordeonSalidas?: IonAccordionGroup ;
  @ViewChild( 'acordeonItinerarios' ) acordeonItinerarios?: IonAccordionGroup ;

  // Tipos de barras de búsqueda disponibles
  public searchBars = SearchBars;

  // Autonomías y provincias devueltas por la API
  public autonomias: any[] | null = null;
  public provincias: any[] | null = null;

  // Formularios y controles
  buscarComunidadForm: FormGroup;
  buscarSalidasForm: FormGroup;
  buscarItinerariosForm: FormGroup;

  provinciaSalidasControl: FormControl;
  provinciaItinerariosControl: FormControl;

  desdeControl: FormControl;
  hastaControl: FormControl;

  distanciaRangeControl: FormControl;
  desnivelRangeControl: FormControl;
  tiempoRangeControl: FormControl;

  // Valores de rangos
  public distanciaRange: RangeValue | null = null;
  public desnivelRange: RangeValue | null = null;
  public tiempoRange: RangeValue | null = null;

  constructor(
    private api: ApiService,
    private alertService: AlertService
  ){
    this.provinciaSalidasControl = new FormControl( { value: '', disabled: true } );
    this.provinciaItinerariosControl = new FormControl( { value: '', disabled: true } );

    this.desdeControl = new FormControl();
    this.hastaControl = new FormControl();

    this.distanciaRangeControl = new FormControl();
    this.desnivelRangeControl = new FormControl();
    this.tiempoRangeControl = new FormControl();

    this.buscarComunidadForm = new FormGroup( {
      texto: new FormControl(),
    } ),
    this.buscarSalidasForm = new FormGroup( {
      texto: new FormControl(),
      codauto: new FormControl(),
      cpro: this.provinciaSalidasControl,
      desde: this.desdeControl,
      hasta: this.hastaControl,
    } ),
    this.buscarItinerariosForm = new FormGroup( {
      texto: new FormControl(),
      cod: new FormControl(),
      codauto: new FormControl(),
      cpro: this.provinciaItinerariosControl,
      dificultad: new FormControl(),
      distancia: this.distanciaRangeControl,
      desnivel: this.desnivelRangeControl,
      tiempo: this.tiempoRangeControl,
      circular: new FormControl(),
    } )
  }

  ngOnInit(){

  }

  buscarSalidas() : void {console.log(this.acordeonSalidas)
    if( this.acordeonSalidas ){
      this.acordeonSalidas.value = undefined;
    }
    
    this.paramsSalidas.emit( this.buscarSalidasForm.value );
  }

  buscarComunidad() : void {
    this.paramsComunidad.emit( this.buscarComunidadForm.value );
  }

  buscarItinerarios() : void {
    if( this.acordeonItinerarios ){
      this.acordeonItinerarios.value = undefined;
    }

    this.paramsItinerarios.emit( this.buscarItinerariosForm.value );
  }

  comprobarYPedirAutonomias() : void {
    if( this.autonomias === null ){
      this.pedirAutonomias();
    }
  }

  manejarAutonomia( ev: any ) : void {
    let provinciaControl: FormControl;
    
    switch( this.search ){
      case SearchBars.Salidas: provinciaControl = this.provinciaSalidasControl; break;
      case SearchBars.Itinerarios: provinciaControl = this.provinciaItinerariosControl; break;

      default: if( isDevMode() === true ) console.warn( 'No se ha podido actualizar las provincias: control no reconocido' ); return;
    }
    
    provinciaControl.reset();

    if( ev.detail &&
        ev.detail.value ){
      const codauto = ev.detail.value;
      if( isNaN( codauto ) === true ){
        provinciaControl.disable();
      } else {
        this.pedirProvincias( codauto );
        provinciaControl.enable();
      }
    } else {
      provinciaControl.disable();
    }
  }

  pedirAutonomias() : void {
    this.api.getAutonomias( {
      successCallback: ( response ) => {
        const responseBody: any = response.body;

        if( Array.isArray( responseBody ) === true ){
          this.autonomias = responseBody;
        } else {
          this.alertService.showToast( 'Ha habido un error. Inténtalo de nuevo más tarde.' ); // Información errónea del servidor
        }
      },
      failedCallback: ( errorResponse ) => {
        this.alertService.errorToToast( errorResponse.error );
      }
    } );
  };

  pedirProvincias( codauto: number | null = null ) : void {
    const requestOptions: TRequestOptions = {
      successCallback: ( response ) => {
        const responseBody: any = response.body;

        if( Array.isArray( responseBody ) === true ){
          this.provincias = responseBody;
        } else {
          this.alertService.showToast( 'Ha habido un error. Inténtalo de nuevo más tarde.' ); // Información errónea del servidor
        }
      },
      failedCallback: ( errorResponse ) => {
        this.alertService.errorToToast( errorResponse.error );
      }
    };

    if( codauto !== null ){
      requestOptions.params = {
        codauto: codauto
      };
    }

    this.api.getProvincias( requestOptions );
  };
}


export enum SearchBars {
  Salidas = 1,
  Comunidad = 2,
  Itinerarios = 3
}
