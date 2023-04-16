import { Component, OnInit, Input, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';

import { commonMethods } from '../commonMethods';

@Component({
  selector: 'app-hikin-usuarioprev',
  templateUrl: './usuarioprev.component.html',
  styleUrls: ['../commonStyle.scss','./usuarioprev.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class UsuarioprevComponent  implements OnInit {

  @Input() usuario: any;

  public static readonly textoSeguir: string = 'Seguir';
  public static readonly textoSiguiendo: string = 'Siguiendo';

  public UsuarioPrev: typeof UsuarioprevComponent = UsuarioprevComponent;

  constructor(
    private api: ApiService,
    private alertService: AlertService,
    public userService: UserService
  ){
  }

  ngOnInit(){}

  /**
   * Sigue o deja de seguir a un usuario
   * 
   * @param ev 
   */
   toggleSeguimiento( ev: any ): void {
    try{
      // Está siguiendo: dejar de seguir
      if( this.usuario.is_siguiendo ){
        this.api.deseguirUsuario( this.usuario.id, {
          successCallback: ( response: any ) => {
            this.usuario.is_siguiendo = 0;
            --this.usuario.n_seguidores;

            ev.target.fill = 'solid';
          },
          failedCallback: ( errorResponse: any ) => {
            this.alertService.errorToToast( errorResponse.error );
          }
        } );
      // No está siguiendo: seguir
      } else{
        this.api.seguirUsuario( this.usuario.id, {
          successCallback: ( response: any ) => {
            this.usuario.is_siguiendo = 1;
            ++this.usuario.n_seguidores;

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

  setDefaultPfp( ev: any ) : void { commonMethods.setDefaultPfp( ev ); }
}
