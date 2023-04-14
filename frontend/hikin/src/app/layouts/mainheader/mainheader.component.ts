import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms'
import { IonicModule } from '@ionic/angular';

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

  @Input() search?: number;

  public searchBars = SearchBars;

  public autonomias: any[] | null = null;
  public provincias: any[] | null = null;

  buscarComunidadForm: FormGroup;
  buscarSalidasForm: FormGroup;
  //buscarItinerariosForm: FormGroup;

  public isProvinciasReadonly: boolean = true;

  constructor(
    private api: ApiService,
    private alertService: AlertService
  ){
    this.buscarComunidadForm = new FormGroup( {
      texto: new FormControl(),
    } );
    this.buscarSalidasForm = new FormGroup( {
      texto: new FormControl(),
      codauto: new FormControl(),
      cpro: new FormControl( { value: '', disabled: true } ),
      desde: new FormControl(),
      hasta: new FormControl(),
    } );
  }

  ngOnInit(){

  }

  buscarComunidad() : void {
    console.log(this.buscarComunidadForm.value);
  }

  buscarSalidas() : void {
    console.log(this.buscarSalidasForm.value);
  }

  buscarItinerarios() : void {

  }

  comprobarYPedirAutonomias() : void {
    if( this.autonomias === null ){
      this.pedirAutonomias();
    }
  }

  manejarAutonomia( ev: any ) : void {
    const provinciaControl = this.buscarSalidasForm.get( 'cpro' ) as FormControl;

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
