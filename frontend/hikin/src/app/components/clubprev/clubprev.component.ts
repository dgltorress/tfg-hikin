import { Component, OnInit, Input, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';

import { commonMethods } from '../commonMethods';

@Component({
  selector: 'app-hikin-clubprev',
  templateUrl: './clubprev.component.html',
  styleUrls: ['../commonStyle.scss','./clubprev.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class ClubprevComponent  implements OnInit {

  @Input() club: any;

  public static readonly textoUnirse: string = 'Unirse';
  public static readonly textoMiembro: string = 'Miembro';

  public static readonly textoInvitacion: string = 'Aceptar invitación';

  public ClubPrev: typeof ClubprevComponent = ClubprevComponent;

  constructor(
    private api: ApiService,
    private alertService: AlertService,
    public userService: UserService
  ){
  }

  ngOnInit(){}

  /**
   * Se une o sale de un club
   * 
   * @param ev 
   */
   toggleMembresia( ev: any ): void {
    try{
      // Es miembro: desinscribirse
      if( this.club.is_miembro ){
        this.api.desinscribirseClub( this.club.id, {
          successCallback: ( response: any ) => {
            this.club.is_miembro = 0;
            this.club.is_invitado = 0;
            --this.club.n_miembros;

            ev.target.fill = 'solid';
          },
          failedCallback: ( errorResponse: any ) => {
            this.alertService.errorToToast( errorResponse.error );
          }
        } );
      // No es miembro: inscribirse
      } else{
        this.api.inscribirseClub( this.club.id, {
          successCallback: ( response: any ) => {
            this.club.is_miembro = 1;
            this.club.is_invitado = 0;
            ++this.club.n_miembros;

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

  setDefaultClub( ev: any ) : void { commonMethods.setDefaultClub( ev ) }
}
