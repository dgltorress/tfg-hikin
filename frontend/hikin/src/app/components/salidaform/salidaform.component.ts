import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms'
import { IonicModule  } from '@ionic/angular';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-hikin-salidaform',
  templateUrl: './salidaform.component.html',
  styleUrls: ['../commonStyle.scss','./salidaform.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class SalidaformComponent  implements OnInit {

  @Input() salida: any = {};
  @Input() accion: 'crear' | 'editar' = 'crear';

  @Output() creado = new EventEmitter<any>();
  @Output() editado = new EventEmitter<any>();

  @Output() nuevaImagen = new EventEmitter<any>();

  public itinerarios: any[] = []; // Se llena sólo la primera página
  public clubes: any[] = []; // Se llena sólo la primera página

  public recursoForm: FormGroup = new FormGroup({});
  public imagenForm: FormGroup = new FormGroup({});

  constructor(
    private api: ApiService,
    private alertService: AlertService
  ){}

  ngOnInit(){
    try{
      this.api.getItinerarios( {
        successCallback: ( response ) => {
          const responseBody: any = response.body;
  
          if( Array.isArray( responseBody.itinerarios ) === true ){
            this.itinerarios = responseBody.itinerarios;
          } else {
            this.alertService.showToast( 'Ha habido un error. Inténtalo de nuevo más tarde.' );
          }
        },
        failedCallback: ( errorResponse ) => {
          this.alertService.errorToToast( errorResponse.error );
        }
      } );
    } catch( err ){
      if( isDevMode() === true ) console.error( err );
    }

    try{
      this.api.getClubes( {
        successCallback: ( response ) => {
          const responseBody: any = response.body;
  
          if( Array.isArray( responseBody.clubes ) === true ){
            this.clubes = responseBody.clubes;
          } else {
            this.alertService.showToast( 'Ha habido un error. Inténtalo de nuevo más tarde.' );
          }
        },
        failedCallback: ( errorResponse ) => {
          this.alertService.errorToToast( errorResponse.error );
        }
      } );
    } catch( err ){
      if( isDevMode() === true ) console.error( err );
    }

    this.recursoForm = new FormGroup( {
      nombre: new FormControl( this.salida.nombre ),
      descripcion: new FormControl( this.salida.descripcion ),
      itinerario: new FormControl( this.salida.itinerario ),
      club: new FormControl( this.salida.club ),
      fecha_inicio: new FormControl( this.salida.fecha_inicio ),
      fecha_fin: new FormControl( this.salida.fecha_fin ),
      privada: new FormControl( Boolean( this.salida.privada ) )
    } );
  }

  crear(): void {
    try{
      // Procesar campos de formulario
      const formValues = this.parseFormValue( this.recursoForm );

      // Hacer petición
      this.api.createSalida( {
        body: formValues,
        successCallback: ( response ) => {
          // Notificar al componente superior
          this.creado.emit();

          this.alertService.showToast( 'Salida creada con éxito' );
        },
        failedCallback: ( errorResponse ) => {
          this.alertService.errorToToast( errorResponse.error );
        }
      } );
    } catch( err ){
      if( isDevMode() === true ) console.error( err );
    }
  }

  editar(): void {
    try{
      // Procesar campos de formulario
      const formValues = this.parseFormValue( this.recursoForm );

      // Hacer petición
      this.api.updateSalida( this.salida.id, {
        body: formValues,
        successCallback: ( response ) => {
          // Notificar al componente superior
          this.editado.emit();

          this.alertService.showToast( 'Salida editada con éxito' );
        },
        failedCallback: ( errorResponse ) => {
          this.alertService.errorToToast( errorResponse.error );
        }
      } );
    } catch( err ){
      if( isDevMode() === true ) console.error( err );
    }
  }

  handleSubmit(): void {
    switch( this.accion ){
      case 'crear': this.crear(); break;
      case 'editar': this.editar(); break;

      default:
        if( isDevMode() === true ){
          console.warn( 'ERROR: acción no reconocida: ' , this.accion );
        }
      break;
    }
  }

  parseFormValue( formGroup: FormGroup ): void {
    const formValues = formGroup.value;

    Object.keys( formValues ).forEach( ( key ) => {
      const param = formValues[ key ];
  
      if( ( param === null ) ||
          ( param === '' ) ){
        delete formValues[ key ];
      }
    } );

    return formValues;
  }

}
