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
  async presentToast(
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
}
