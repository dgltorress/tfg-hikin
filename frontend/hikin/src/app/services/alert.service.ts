import { Injectable } from '@angular/core';
import { ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private toastController: ToastController
  ){}

  /**
   * Muestra una notificación toast de Ionic por pantalla.
   * 
   * @param message Mensaje de la notificación.
   * @param duration Milisegundos durante los que se mostrará.
   * @param icon Icono adicional a mostrar en el lado izquierdo.
   * @param position Posición de la notificación.
   */
  async showToast(
    message: string = 'Sin mensaje',
    duration: number = 1500,
    icon: string | null = null,
    position: 'top' | 'middle' | 'bottom' = 'bottom',
  ){
    const toastOptions: ToastOptions = {
      message: message,
      duration: duration,
      position: position
    }
    if( icon !== null ){
      toastOptions.icon = icon;
    }

    const toast = await this.toastController.create( toastOptions );

    await toast.present();
  }

  /**
   * Muestra un error recibido del servidor como una notificación toast de Ionic por pantalla.
   * 
   * Busca un único campo `msg` en el cuerpo de la respuesta
   * o el primer error devuelto por el objeto que genera Express Validator
   * 
   * @param errorBody Cuerpo de la respuesta de error.
   * @param duration Milisegundos durante los que se mostrará.
   * @param icon Icono adicional a mostrar en el lado izquierdo.
   * @param position Posición de la notificación.
   */
   async errorToToast(
    errorBody: any,
    duration: number = 1500,
    icon: string | null = null,
    position: 'top' | 'middle' | 'bottom' = 'bottom',
  ){
    if( errorBody ){
      if( errorBody.msg ){
        await this.showToast( errorBody.msg, duration, icon, position );
        return;
      } else if( errorBody.errors ){
        const firstKey = Object.keys( errorBody.errors )[ 0 ];
        const firstError = errorBody.errors[ firstKey ];

        if( firstError.msg ){
          await this.showToast( `(${firstKey}) ${firstError.msg}`, duration, icon, position );
          return;
        }
      }

      await this.showToast( 'Ha habido un error no reconocido. Inténtalo de nuevo más tarde.', duration, icon, position );
    } else {
      await this.showToast( 'Ha habido un error. Inténtalo de nuevo más tarde.', duration, icon, position );
    }
  }
}
