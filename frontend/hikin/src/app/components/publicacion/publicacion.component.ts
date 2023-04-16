import { Component, OnInit, Input, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';

import { commonMethods } from '../commonMethods';

@Component({
  selector: 'app-hikin-publicacion',
  templateUrl: './publicacion.component.html',
  styleUrls: ['../commonStyle.scss','./publicacion.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class PublicacionComponent implements OnInit {

  @Input() publicacion: any;

  constructor(
    private api: ApiService,
    private alertService: AlertService,
  ){
  }

  ngOnInit(){
    this.publicacion.fecha = commonMethods.fechaISOALegible( this.publicacion.fecha );
  }

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

  setDefaultImage( ev: any ) : void { commonMethods.setDefaultImage( ev ); }
  setDefaultPfp( ev: any ) : void { commonMethods.setDefaultPfp( ev ); }
}
