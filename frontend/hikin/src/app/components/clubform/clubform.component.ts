import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms'
import { IonicModule  } from '@ionic/angular';

import { ApiService, TRequestOptions } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-hikin-clubform',
  templateUrl: './clubform.component.html',
  styleUrls: ['../commonStyle.scss','./clubform.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class ClubformComponent  implements OnInit {

  @Input() club: any = {};
  @Input() accion: 'crear' | 'editar' = 'crear';

  @Output() creado = new EventEmitter<any>();
  @Output() editado = new EventEmitter<any>();

  @Output() nuevaImagen = new EventEmitter<any>();

  @ViewChild( 'imagenField' ) imagenField?: ElementRef;
  @ViewChild( 'preview' ) preview?: ElementRef;

  public autonomias: any[] = [];
  public provincias: any[] = [];

  public recursoForm: FormGroup = new FormGroup({});
  public imagenForm: FormGroup = new FormGroup({});

  public provinciaControl: FormControl = new FormControl( '' );

  constructor(
    private api: ApiService,
    private alertService: AlertService
  ){}

  ngOnInit(){
    try{
      this.api.getAutonomias( {
        successCallback: ( response ) => {
          const responseBody: any = response.body;
  
          if( Array.isArray( responseBody ) === true ){
            this.autonomias = responseBody
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

    this.provinciaControl = new FormControl( { value: this.club.cpro, disabled: false } );

    if( this.club.codauto ){
      this.manejarAutonomia( this.club.codauto );
    }

    this.recursoForm = new FormGroup( {
      nombre: new FormControl( this.club.nombre ),
      descripcion: new FormControl( this.club.descripcion ),
      codauto: new FormControl( this.club.codauto ),
      cpro: this.provinciaControl,
      privado: new FormControl( Boolean( this.club.privado ) )
    } );

    this.imagenForm = new FormGroup( {
      imagen: new FormControl()
    } );
  }

  crear(): void {
    try{
      // Procesar campos de formulario
      const formValues = this.parseFormValue( this.recursoForm );

      // Hacer petición
      this.api.createClub( {
        body: formValues,
        successCallback: ( response ) => {
          // Notificar al componente superior
          this.creado.emit();

          this.alertService.showToast( 'Club creado con éxito' );
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
      this.api.updateClub( this.club.id, {
        body: formValues,
        successCallback: ( response ) => {
          // Notificar al componente superior
          this.editado.emit();

          this.alertService.showToast( 'Club editado con éxito' );
        },
        failedCallback: ( errorResponse ) => {
          this.alertService.errorToToast( errorResponse.error );
        }
      } );
    } catch( err ){
      if( isDevMode() === true ) console.error( err );
    }
  }

  subirImagen(): void {
    try{
      if( this.imagenField ){
        // Procesar campos de formulario
        const formData = new FormData();
        formData.append( 'imagen' , this.imagenField.nativeElement.files[ 0 ] );

        // Hacer petición
        this.api.subirImagenClub( this.club.id, {
          body: formData,
          successCallback: ( response ) => {
            const responseBody: any = response.body;
            if( responseBody && responseBody.imagen ){
              // Enviar la URL de la nueva imagen
              this.editado.emit( responseBody.imagen );
            }

            this.alertService.showToast( 'Imagen de club actualizada' );
          },
          failedCallback: ( errorResponse ) => {
            this.alertService.errorToToast( errorResponse.error );
          }
        } );
      }
      
    } catch( err ){
      if( isDevMode() === true ) console.error( err );
    }
  }

  eliminarImagen(): void {
    try{
      // Hacer petición
      this.api.eliminarImagenClub( this.club.id, {
        successCallback: ( response ) => {
          // Enviar la URL vacía
          this.editado.emit( '' );

          this.alertService.showToast( 'Imagen de club eliminada' );
        },
        failedCallback: ( errorResponse ) => {
          this.alertService.errorToToast( errorResponse.error );
        }
      } );
    } catch( err ){
      if( isDevMode() === true ) console.error( err );
    }
  }

  manejarAutonomia( ev: any ) : void {
    this.provinciaControl.reset();

    if( ev.detail &&
        ev.detail.value ){
      const codauto = ev.detail.value;
      if( isNaN( codauto ) === true ){
        this.provinciaControl.disable();
      } else {
        this.pedirProvincias( codauto );
        this.provinciaControl.enable();
      }
    } else {
      this.provinciaControl.disable();
    }
  }

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

  showPreview( inputEvent: any ): void {
    const inputElement = inputEvent.target;

    if( inputElement &&
        inputElement.files &&
        inputElement.files[0] ) {
      const fileReader = new FileReader();

      fileReader.onload = ( ev ) => {
        if( ev.target && this.preview ){
          this.preview.nativeElement.src = ev.target.result;
        }
      };

      fileReader.readAsDataURL( inputElement.files[ 0 ] );
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
