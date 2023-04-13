import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { ApiService, TRequestOptions } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['signup.page.scss','../login/login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, ReactiveFormsModule]
})
export class SignupPage implements OnInit {

  @ViewChild( 'errEmail' ) errEmail?: ElementRef;
  @ViewChild( 'errPassword' ) errPassword?: ElementRef;
  @ViewChild( 'errUsername' ) errUsername?: ElementRef;

  signupForm: FormGroup;

  readonly emailFormControlName: string = 'email';
  readonly passwordFormControlName: string = 'contrasena';
  readonly usernameFormControlName: string = 'usuario';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private alertService: AlertService
  ){
    this.signupForm = new FormGroup( {
      [ this.emailFormControlName ]: new FormControl( '' , [
        Validators.required,
        Validators.email,
        Validators.maxLength( 60 )
      ] ),
      [ this.passwordFormControlName ]: new FormControl( '' , [
        Validators.required,
        Validators.minLength( 8 )
      ] ),
      [ this.usernameFormControlName ]: new FormControl( '' , [
        Validators.required,
        Validators.minLength( 3 ),
        Validators.maxLength( 25 )
      ] )
    } );
  }

  ngOnInit(){
    
  }

  /**
   * Intenta crear un usuario en la base de datos.
   * Si lo consigue, guarda las credenciales
   * y redirige a la página de inicio.
   */
  signup() : void {
    // Si los campos contienen valores correctos,
    if( this.validateSignup() === true ){
      // Se obtienen los valores del formulario
      const signupFormValue = this.signupForm.value;

      // Se envía una petición al endpoint de autenticación
      const options: TRequestOptions = {
        body: signupFormValue,
        successCallback: ( response ) => {
          const responseBody: any = response.body;

          if( responseBody &&
              responseBody[ UserService.userField ] &&
              responseBody[ UserService.tokenField ] ){
            this.authService.login( responseBody, true );
          } else {
            this.alertService.showToast( 'Ha habido un error. Inténtalo de nuevo más tarde.' ); // Información errónea del servidor
          }
        },
        failedCallback: ( errorResponse ) => {
          this.alertService.errorToToast( errorResponse.error );
        }
      };

      this.apiService.createUsuario( options );
    }
  }

  /**
   * Valida los campos del formulario y gestiona mensajes de error visuales.
   * 
   * @returns Si todos los campos contienen valores correctos.
   */
  validateSignup() : boolean {
    // Obtiene los controles del grupo de formulario
    const signupFormControls = this.signupForm.controls;

    // Obtiene los errores de cada control
    const usernameErrors = signupFormControls[ this.usernameFormControlName ].errors;
    const emailErrors = signupFormControls[ this.emailFormControlName ].errors;
    const passwordErrors = signupFormControls[ this.passwordFormControlName ].errors;

    // Si hay algún error,
    if( usernameErrors || emailErrors || passwordErrors ){
      // y hay un lugar donde colocar un mensaje de error para el nombre de usuario,
      if( this.errUsername ){
        const errUsernameElement = this.errUsername.nativeElement;

        // Si hay errores de nombre de usuario,
        if( usernameErrors ){
          const usernameKeys = Object.keys( usernameErrors );

          for( let i = 0 ; i < usernameKeys.length ; ++i ){
            // se indica el error.
            switch( usernameKeys[ i ] ){
              case 'required': errUsernameElement.innerText = 'Campo requerido'; break;
              case 'minlength':
              case 'maxlength':
                errUsernameElement.innerText = 'Entre 3 y 25 caracteres';
              break;
            }
          }
        // Si no hay errores de email,
        } else {
          // se quita el mensaje de error.
          errUsernameElement.innerText = '';
        }
      }
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
              case 'maxlength': errEmailElement.innerText = 'Máx. 60 caracteres'; break;
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
              case 'minlength': errPasswordElement.innerText = 'Mín. 8 caracteres'; break;
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
      if( this.errUsername ) this.errUsername.nativeElement.innerText = '';
      if( this.errEmail ) this.errEmail.nativeElement.innerText = '';
      if( this.errPassword ) this.errPassword.nativeElement.innerText = '';

      return true;
    }
  }
}
