import { Component, OnInit, Input, isDevMode, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';

import { ClubformComponent } from 'src/app/components/clubform/clubform.component';

import { commonMethods } from 'src/app/components/commonMethods';

@Component({
  selector: 'app-hikin-clubheader',
  templateUrl: './clubheader.component.html',
  styleUrls: ['../../pages/public/commonStyle.scss','../headerSpecific.scss','./clubheader.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, ClubformComponent]
})
export class ClubheaderComponent implements OnInit {

  @Input() titulo: string = 'Club';
  @Input() club: any;

  @Output() nuevoClub = new EventEmitter<any>();

  public isEditOpen: boolean = false;

  public static readonly textoInscribirse: string = 'Inscribirse';
  public static readonly textoInscrito: string = 'Inscrito';

  public clubheaderComponent: typeof ClubheaderComponent = ClubheaderComponent;

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
  toggleInscripcion( ev: any ): void {
    try{
      // Es miembro: desinscribirse
      if( this.club.is_miembro ){
        this.api.desinscribirseClub( this.club.id, {
          successCallback: ( response: any ) => {
            this.club.is_miembro = 0;
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

  eliminarClub( ev: any ): void {
    try{
      this.api.deleteClub( this.club.id, {
        successCallback: ( response: any ) => {
          this.alertService.showToast( `Club "${this.club.nombre}" eliminado` );
          this.router.navigate( [ '/home/comunidad' ] );
        },
        failedCallback: ( errorResponse: any ) => {
          this.alertService.errorToToast( errorResponse.error );
        }
      } );
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

  emitirNuevoClub(): void {
    this.isEditOpen = false;

    this.nuevoClub.emit();
  }

  setImagen( ev: any ): void {
    this.club.imagen = ev;
  }

  setDefaultClub( ev: any ) : void { commonMethods.setDefaultClub( ev ); }
}
