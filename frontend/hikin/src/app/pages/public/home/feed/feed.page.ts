import { Component, OnInit, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponent } from 'src/app/components/explore-container/explore-container.component';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services/alert.service';

import { MainheaderComponent } from 'src/app/layouts/mainheader/mainheader.component';

import { PublicacionComponent } from 'src/app/components/publicacion/publicacion.component';

@Component({
  selector: 'app-feed',
  templateUrl: 'feed.page.html',
  styleUrls: ['feed.page.scss','../home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, MainheaderComponent, PublicacionComponent, ExploreContainerComponent]
})
export class FeedPage implements OnInit {

  public publicaciones: any[] | null = null;
  public paginaActual: number = 0;

  constructor(
    private api: ApiService,
    private userService: UserService,
    private alertService: AlertService
  ){}

  ngOnInit(): void {
    this.getFeed();
  }

  getFeed(): void {
    if( this.userService.user &&
        this.userService.user.id ){
      this.api.getUsuarioFeed( this.userService.user.id, {
        params: {
          p: this.paginaActual++
        },
        successCallback: ( response: any ) => {
          if( this.publicaciones === null ) this.publicaciones = [];

          const responseBody: any = response.body;

          if( Array.isArray( responseBody.publicaciones ) === true ){
            const responsePublicaciones = responseBody.publicaciones;

            for( let i = 0; i < responsePublicaciones.length; ++i ){
              const publicacionActual = responsePublicaciones[ i ];
              
              if( publicacionActual &&
                  publicacionActual.fecha ){
                try{
                  publicacionActual.fecha = new Intl.DateTimeFormat( 'es', {
                    dateStyle: 'medium', timeStyle: 'short'
                  } ).format( new Date( publicacionActual.fecha ),  );console.log(publicacionActual.fecha);
                } catch( err ){
                  if( isDevMode() === true ) console.warn( '[getFeed()] ERROR al traducir la fecha de la publicación: ', err );
                }
              }
              this.publicaciones.push( publicacionActual );
            }
          } else {
            this.alertService.showToast( 'Ha habido un error. Inténtalo de nuevo más tarde.' ); // Información errónea del servidor
          }
        },
        failedCallback: ( errorResponse: any ) => {
          this.alertService.errorToToast( errorResponse.error );
        }
      } );
    } else {
      if( isDevMode() === true ) console.warn( '[getFeed()] No se ha podido extraer el identificador del usuario desde el servicio' );
    }
  }
}
