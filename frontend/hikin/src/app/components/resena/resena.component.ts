import { Component, OnInit, Input, Output, EventEmitter, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';

import { commonMethods } from '../commonMethods';

@Component({
  selector: 'app-hikin-resena',
  templateUrl: './resena.component.html',
  styleUrls: ['../commonStyle.scss','./resena.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class ResenaComponent  implements OnInit {

  @Input() resena: any;
  @Input() itId?: number;

  @Output() eliminame = new EventEmitter<any>();

  public valoracion: number[] = Array( 0 );
  public resto: number[] = Array( 0 );

  constructor(
    private api: ApiService,
    private alertService: AlertService,
    public userService: UserService
  ){}

  ngOnInit(){
    this.valoracion = Array( this.resena.valoracion ).fill( 0 );
    this.resto = Array( 5 - this.resena.valoracion ).fill( 0 );

    if( !this.resena.changedDate ){
      this.resena.fecha = commonMethods.fechaISOALegible( this.resena.fecha );

      this.resena.changedDate = true;
    }
  }

  eliminarResena(): void {
    try{
      if( this.itId ){
        this.api.deleteItinerarioResenas( this.itId, this.resena.usuario , {
          successCallback: ( response: any ) => {
            this.eliminame.emit( this.resena.usuario );
          },
          failedCallback: ( errorResponse: any ) => {
            this.alertService.errorToToast( errorResponse.error );
          }
          }
        );
      }
    } catch( err ){
      this.alertService.showToast( 'Ha habido un error' );
      if( isDevMode() === true ){ console.error( 'ERROR al publicar el comentario: ' , err ) }
    }
  }

  setDefaultPfp( ev: any ) : void { commonMethods.setDefaultPfp( ev ); }
}
