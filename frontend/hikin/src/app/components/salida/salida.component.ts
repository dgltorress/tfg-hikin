import { Component, OnInit, Input, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';

import { commonMethods } from '../commonMethods';

@Component({
  selector: 'app-hikin-salida',
  templateUrl: './salida.component.html',
  styleUrls: ['../commonStyle.scss','./salida.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class SalidaComponent implements OnInit {

  public static readonly textoInscribirse: string = 'Inscribirse';
  public static readonly textoInscrito: string = 'Inscrito';

  public salidaComponent: typeof SalidaComponent = SalidaComponent;

  @Input() salida: any;

  constructor(
    private api: ApiService,
    private alertService: AlertService,
    public userService: UserService
  ){
  }

  ngOnInit(){
    if( !this.salida.changedDates ){
      this.salida.fecha_inicio = commonMethods.fechaISOALegible( this.salida.fecha_inicio, 'es', 'long', 'short' );
      this.salida.fecha_fin = commonMethods.fechaISOALegible( this.salida.fecha_fin, 'es', 'long', 'short' );

      this.salida.changedDates = true;
    }
  }

  /**
   * Se inscribe o se desinscribe de una salida.
   * 
   * @param ev 
   */
   toggleInscripcion( ev: any ): void {
    try{
      // Está inscrito: desinscribirse
      if( this.salida.is_participante ){
        this.api.desinscribirseSalida( this.salida.id, {
          successCallback: ( response: any ) => {
            this.salida.is_participante = 0;
            --this.salida.n_participantes;

            ev.target.fill = 'solid';
          },
          failedCallback: ( errorResponse: any ) => {
            this.alertService.errorToToast( errorResponse.error );
          }
        } );
      // No está inscrito: inscribirse
      } else{
        this.api.inscribirseSalida( this.salida.id, {
          successCallback: ( response: any ) => {
            this.salida.is_participante = 1;
            ++this.salida.n_participantes;

            ev.target.fill = 'outline';
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

  cancelarSalida( ev: any ): void {

  }

  setDefaultPfp( ev: any ) : void { commonMethods.setDefaultPfp( ev ); }
}
