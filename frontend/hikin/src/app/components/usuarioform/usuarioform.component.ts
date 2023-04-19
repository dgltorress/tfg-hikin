import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms'
import { IonicModule  } from '@ionic/angular';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-hikin-usuarioform',
  templateUrl: './usuarioform.component.html',
  styleUrls: ['../commonStyle.scss','./usuarioform.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class UsuarioformComponent  implements OnInit {

  @Input() usuario: any = {};
  @Input() accion: 'crear' | 'editar' = 'crear';

  @Output() creado = new EventEmitter<any>();
  @Output() editado = new EventEmitter<any>();

  @Output() nuevaImagen = new EventEmitter<any>();

  @ViewChild( 'imagenField' ) imagenField?: ElementRef;
  @ViewChild( 'preview' ) preview?: ElementRef;

  public recursoForm: FormGroup = new FormGroup({});
  public imagenForm: FormGroup = new FormGroup({});

  constructor(
    private api: ApiService,
    private alertService: AlertService
  ){}

  ngOnInit(){
    this.recursoForm = new FormGroup( {
      usuario: new FormControl( this.usuario.usuario ),
      nombre: new FormControl( this.usuario.nombre ),
      bio: new FormControl( this.usuario.bio ),
      sexo: new FormControl( this.usuario.sexo ),
      fecha_nac: new FormControl( this.usuario.fecha_nac ),
      privado: new FormControl( Boolean( this.usuario.privado ) ),
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
      this.api.createUsuario( {
        body: formValues,
        successCallback: ( response ) => {
          // Notificar al componente superior
          this.creado.emit();

          this.alertService.showToast( 'Usuario creado con éxito' );
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
      this.api.updateUsuario( this.usuario.id, {
        body: formValues,
        successCallback: ( response ) => {
          // Notificar al componente superior
          this.editado.emit();

          this.alertService.showToast( 'Usuario editado con éxito' );
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
        this.api.subirPfp( this.usuario.id, {
          body: formData,
          successCallback: ( response ) => {
            const responseBody: any = response.body;
            if( responseBody && responseBody.imagen ){
              // Enviar la URL de la nueva imagen
              this.editado.emit( responseBody.imagen );
            }

            this.alertService.showToast( 'Foto de perfil actualizada' );
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
      this.api.eliminarPfp( this.usuario.id, {
        successCallback: ( response ) => {
          // Enviar la URL vacía
          this.editado.emit( '' );

          this.alertService.showToast( 'Foto de perfil eliminada' );
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
