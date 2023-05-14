import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { ApiService, TRequestOptions } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {

  @ViewChild( 'errEmail' ) errEmail?: ElementRef;
  @ViewChild( 'errPassword' ) errPassword?: ElementRef;

  loginForm: FormGroup;

  readonly emailFormControlName: string = 'email';
  readonly passwordFormControlName: string = 'contrasena';

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService,
    private alertService: AlertService
  ){
    this.loginForm = new FormGroup( {
      [ this.emailFormControlName ]: new FormControl( '' , [
        Validators.required,
        Validators.email
      ] ),
      [ this.passwordFormControlName ]: new FormControl( '' , [
        Validators.required
      ] )
    } );
  }

  ngOnInit(){
    // Notificar error de autenticación (p. ej. Si el token caduca o se han borrado las cookies)
    this.activatedRoute.queryParamMap
      .subscribe( ( paramMap ) => {
        const caughtError: string | null = paramMap.get( 'err' );

        if( caughtError !== null ){
          const caughtErrorStatus: number = parseInt( caughtError );
          if( caughtErrorStatus === 401 ){
            this.alertService.showToast( 'Error al autenticar' );
          }
        }
      }
    );
  }

  /**
   * Envía las credenciales del usuario a la base de datos,
   * almacena el token y la fecha de caducidad del token recibido
   * y redirige a la página de inicio.
   */
  login() : void {
    // Si los campos contienen valores correctos,
    if( this.validateLogin() === true ){
      // Se obtienen los valores del formulario
      const loginFormValue = this.loginForm.value;

      // Se envía una petición al endpoint de autenticación
      const options: TRequestOptions = {
        body: loginFormValue,
        successCallback: ( response ) => {
          const responseBody: any = response.body;

          if( responseBody &&
              responseBody[ UserService.userField ] &&
              responseBody[ UserService.tokenField ] ){
            this.authService.login( responseBody, true );
          } else {
            this.alertService.showToast( 'Ha habido un error en el servidor. Inténtalo de nuevo más tarde.' ); // Información errónea del servidor
          }
        },
        failedCallback: ( errorResponse ) => {
          switch( errorResponse.status ){
            case 404: { // Error de conexión
              this.alertService.showToast( 'No se ha podido conectar con la API. Introduce una URL donde se esté sirviendo en el menú de ajustes.' , 5500 );
            } break;

            default: { // Credenciales erróneas u otro error
              this.alertService.errorToToast( errorResponse.error ); 
            } break;
          }
        }
      };

      this.apiService.auth( options );
    }
  }

  /**
   * Valida los campos del formulario y gestiona mensajes de error visuales.
   * 
   * @returns Si todos los campos contienen valores correctos.
   */
  validateLogin() : boolean {
    // Obtiene los controles del grupo de formulario
    const loginFormControls = this.loginForm.controls;

    // Obtiene los errores de cada control
    const emailErrors = loginFormControls[ this.emailFormControlName ].errors;
    const passwordErrors = loginFormControls[ this.passwordFormControlName ].errors;

    // Si hay algún error,
    if( emailErrors || passwordErrors ){
      // y hay un lugar donde colocar un mensaje de error para el email,
      if( this.errEmail ){
        const errEmailElement = this.errEmail.nativeElement;

        // Si hay errores de email,
        if( emailErrors ){
          const emailKeys = Object.keys( emailErrors );

          for( let i = 0 ; i < emailKeys.length ; ++i ){
            // se indica el error.
            switch( emailKeys[ i ] ){
              case 'required': errEmailElement.innerText = 'Campo requerido'; break;
              case 'email': errEmailElement.innerText = 'Email no válido'; break;
            }
          }
        // Si no hay errores de email,
        } else {
          // se quita el mensaje de error.
          errEmailElement.innerText = '';
        }
      }
      // y hay un lugar donde colocar un mensaje de error para la contraseña,
      if( this.errPassword ){
        const errPasswordElement = this.errPassword.nativeElement;
  
        // Si hay errores de contraseña,
        if( passwordErrors ){
          const passwordKeys = Object.keys( passwordErrors );
  
          for( let i = 0 ; i < passwordKeys.length ; ++i ){
            // se indica el error.
            switch( passwordKeys[ i ] ){
              case 'required': errPasswordElement.innerText = 'Campo requerido'; break;
            }
          }
        // Si no hay errores de contraseña,
        } else {
          // se quita el mensaje de error.
          errPasswordElement.innerText = '';
        }
      }

      return false;
    // Si no hay ningún error,
    } else {
      // se quitan los mensajes de error si se pueden localizar.
      if( this.errEmail ) this.errEmail.nativeElement.innerText = '';
      if( this.errPassword ) this.errPassword.nativeElement.innerText = '';

      return true;
    }
  }
}
