import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms'
import { IonicModule  } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-hikin-publicacionform',
  templateUrl: './publicacionform.component.html',
  styleUrls: ['../commonStyle.scss','./publicacionform.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterModule]
})
export class PublicacionformComponent  implements OnInit {

  @Input() publicacion: any = {};
  @Input() accion: 'crear' | 'editar' = 'crear';

  @Output() creado = new EventEmitter<any>();
  @Output() editado = new EventEmitter<any>();

  @Output() nuevaImagen = new EventEmitter<any>();

  @ViewChild( 'imagenField' ) imagenField?: ElementRef;
  @ViewChild( 'preview' ) preview?: ElementRef;

  public itinerarios: any[] = []; // Se llena sólo la primera página
  public clubesUsuario: any[] = [];

  public recursoForm: FormGroup = new FormGroup({});

  constructor(
    private api: ApiService,
    private alertService: AlertService,
    private userService: UserService,
    private router: Router
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
      this.api.getUsuarioClubes( this.userService.user.id, {
        successCallback: ( response ) => {
          const responseBody: any = response.body;
  
          if( Array.isArray( responseBody ) === true ){
            this.clubesUsuario = responseBody;
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
      titulo: new FormControl( this.publicacion.titulo ),
      descripcion: new FormControl( this.publicacion.descripcion ),
      itinerario: new FormControl( this.publicacion.itinerario ),
      club: new FormControl( this.publicacion.club ),
      imagen: new FormControl()
    } );
  }

  crear(): void {
    try{
      // Procesar campos de formulario
      const formValues = this.parseFormValue( this.recursoForm );

      // Hacer petición
      this.api.createPublicacion( {
        body: formValues,
        successCallback: ( response ) => {
          // Si hay imagen, se sube por otra ruta
          if( this.imagenField ){
            const responseBody: any = response.body;
            const imagenArchivo = this.imagenField.nativeElement.files[ 0 ];

            if( imagenArchivo && responseBody && responseBody.id ){
              // Procesar campos de formulario
              const formData = new FormData();
              formData.append( 'imagen' , imagenArchivo );
              
              // Hacer petición
              this.api.subirImagenPublicacion( responseBody.id, {
                body: formData,
                successCallback: ( response2 ) => {
                  // Notificar al componente superior
                  this.creado.emit();

                  // Ir al recurso creado
                  const responseBody2: any = response2.body;

                  if( responseBody2 && responseBody2.id ){
                    this.router.navigate( [ `/publicacion/${responseBody2.id}` ] );
                  }
                },
                failedCallback: ( errorResponse ) => {
                  this.alertService.errorToToast( errorResponse.error );
                }
              } );
            } else {
              // Notificar al componente superior
              this.creado.emit();

              // Ir al recurso creado
              const responseBody: any = response.body;

              if( responseBody && responseBody.id ){
                this.router.navigate( [ `/publicacion/${responseBody.id}` ] );
              }
            }
          }
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
