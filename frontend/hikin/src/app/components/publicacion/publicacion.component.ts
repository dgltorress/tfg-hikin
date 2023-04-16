import { Component, OnInit, Input, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-hikin-publicacion',
  templateUrl: './publicacion.component.html',
  styleUrls: ['./publicacion.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class PublicacionComponent  implements OnInit {

  @Input() publicacion: any;

  private static readonly defaultImageSource: string = 'assets/img/bg-default-black.png';
  private static readonly defaultPfpSource: string = 'assets/img/user-default.png';

  constructor(
    private api: ApiService,
    private alertService: AlertService,
  ){
  }

  ngOnInit(){}

  /**
   * Da o quita kudos a la publicación.
   * 
   * @param ev 
   */
  toggleKudos( ev: any ): void {
    try{
      // Tiene kudos: quitar
      if( this.publicacion.is_kudos ){
        this.api.quitarKudos( this.publicacion.id, {
          successCallback: ( response: any ) => {
            this.publicacion.is_kudos = 0;
            --this.publicacion.n_kudos;

            ev.target.name = 'thumbs-up-outline';
          },
          failedCallback: ( errorResponse: any ) => {
            this.alertService.errorToToast( errorResponse.error );
          }
        } );
      // No tiene kudos: dar
      } else{
        this.api.darKudos( this.publicacion.id, {
          successCallback: ( response: any ) => {
            this.publicacion.is_kudos = 1;
            ++this.publicacion.n_kudos;

            ev.target.name = 'thumbs-up';
          },
          failedCallback: ( errorResponse: any ) => {
            this.alertService.errorToToast( errorResponse.error );
          }
        } );
      }
    } catch( err ){
      if( isDevMode() === true ){
        console.error( 'Ha habido un error local: ', err );
      }
      this.alertService.errorToToast( 'Ha habido un error' );
    }
    
  }

  setDefaultImage( ev: any ) : void {
    if( isDevMode() === true ){
      console.warn( `No se ha podido encontrar la imagen en la URL: ${ev.target.src}` );
    }
    
    if( ev && ev.target ){
      ev.target.src = PublicacionComponent.defaultImageSource;
    }
    else{
      if( isDevMode() === true ){
        console.error( 'No se ha devuelto un evento válido para situar la imagen por defecto: ' , ev );
      }
    }
  }

  setDefaultPfp( ev: any ) : void {
    if( isDevMode() === true ){
      console.warn( `No se ha podido encontrar la foto de perfil en la URL: ${ev.target.src}` );
    }
    
    if( ev && ev.target ){
      ev.target.src = PublicacionComponent.defaultPfpSource;
    }
    else{
      if( isDevMode() === true ){
        console.error( 'No se ha devuelto un evento válido para situar la foto de perfil por defecto: ' , ev );
      }
    }
  }
}
