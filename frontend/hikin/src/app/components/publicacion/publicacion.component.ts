import { Component, OnInit, Input, ViewChild, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonModal } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';

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

  @ViewChild( IonModal ) socialShareModal?: IonModal;

  public href: string = "";
  public isSocialShareOpen: boolean = false;

  constructor(
    private api: ApiService,
    private alertService: AlertService
  ){
  }

  ngOnInit(){
    this.href = `${window.location.host}/publicaciones/${this.publicacion.id}`;

    if( !this.publicacion.parsedDate ){
      this.publicacion.fecha = commonMethods.fechaISOALegible( this.publicacion.fecha );

      this.publicacion.parsedDate = true;
    }
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

  toggleCompartir( open: boolean ): void {
    this.isSocialShareOpen = open;
  }

  setDefaultImage( ev: any ) : void { commonMethods.setDefaultImage( ev ); }
  setDefaultPfp( ev: any ) : void { commonMethods.setDefaultPfp( ev ); }
}
