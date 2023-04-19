import { Component, OnInit, Input, isDevMode, Output, EventEmitter, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';

import { UsuarioformComponent } from 'src/app/components/usuarioform/usuarioform.component';

import { commonMethods } from 'src/app/components/commonMethods';

@Component({
  selector: 'app-hikin-userheader',
  templateUrl: './userheader.component.html',
  styleUrls: ['../../pages/public/commonStyle.scss','../headerSpecific.scss','./userheader.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, UsuarioformComponent]
})
export class UserheaderComponent implements OnInit {

  @Input() titulo: string = 'Perfil';
  @Input() usuario: any;

  @Output() nuevoUsuario = new EventEmitter<any>();

  public isEditOpen: boolean = false;

  public static readonly textoSeguir: string = 'Seguir';
  public static readonly textoSiguiendo: string = 'Siguiendo';

  public userheaderComponent: typeof UserheaderComponent = UserheaderComponent;

  constructor(
    private api: ApiService,
    private alertService: AlertService,
    public userService: UserService,
    private router: Router
  ){
  }

  ngOnInit(){
  }

  /**
   * Se inscribe o se desinscribe de una salida.
   * 
   * @param ev 
   */
  toggleSeguimiento( ev: any ): void {
    try{
      // Sigue: dejar de seguir
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
      // No sigue: seguir
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

  toggleEditar( opened: boolean ): void {
    this.isEditOpen = opened;
  }

  emitirNuevoUsuario(): void {
    this.isEditOpen = false;

    this.nuevoUsuario.emit();
  }

  setImagen( ev: any ): void {
    this.usuario.imagen = ev;
  }

  setDefaultClub( ev: any ) : void { commonMethods.setDefaultClub( ev ); }
}
