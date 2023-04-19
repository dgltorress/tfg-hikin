import { Component, OnInit, Input, Output, EventEmitter, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms'
import { IonicModule  } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-hikin-usuarioform',
  templateUrl: './usuarioform.component.html',
  styleUrls: ['../commonStyle.scss','./usuarioform.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterModule]
})
export class UsuarioformComponent  implements OnInit {

  @Input() usuario: any;
  @Input() accion: 'crear' | 'editar' = 'crear';

  @Output() nuevoUsuario = new EventEmitter<any>();

  public usuarioForm: FormGroup = new FormGroup({});
  public imagenForm: FormGroup = new FormGroup({});

  constructor(
    private api: ApiService,
    private alertService: AlertService,
    private router: Router
  ){}

  ngOnInit(){
    this.usuarioForm = new FormGroup( {
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

  handleSubmit(): void {
    switch( this.accion ){
      case 'crear': this.crearUsuario(); break;
      case 'editar': this.editarUsuario(); break;

      default:
        if( isDevMode() === true ){
          console.warn( 'ERROR: acción no reconocida: ' , this.accion );
        }
      break;
    }
  }

  crearUsuario(): void {

  }

  editarUsuario(): void {
    try{
      // Procesar campos de formulario
      const formValues = this.usuarioForm.value;

      Object.keys( formValues ).forEach( ( key ) => {
        const param = formValues[ key ];
  
        if( ( param === null ) ||
            ( param === '' ) ){
          delete formValues[ key ];
        }
      } );

      // Hacer petición
      this.api.updateUsuario( this.usuario.id, {
        body: formValues,
        successCallback: ( response ) => {
          this.nuevoUsuario.emit();

          // Salir
          // this.router.navigate( [ '' ] );
        },
        failedCallback: ( errorResponse ) => {
          this.alertService.errorToToast( errorResponse.error );
        }
      } );
    } catch( err ){
      if( isDevMode() === true ) console.error( err );
    }
  }

}
