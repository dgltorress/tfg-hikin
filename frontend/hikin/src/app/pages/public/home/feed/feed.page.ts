import { Component, OnInit, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, InfiniteScrollCustomEvent } from '@ionic/angular';

import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services/alert.service';

import { MainheaderComponent } from 'src/app/layouts/mainheader/mainheader.component';
import { PublicacionComponent } from 'src/app/components/publicacion/publicacion.component';

import { PublicacionformComponent } from 'src/app/components/publicacionform/publicacionform.component';

@Component({
  selector: 'app-feed',
  templateUrl: 'feed.page.html',
  styleUrls: ['../../commonStyle.scss','../home.page.scss','feed.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, MainheaderComponent,
    PublicacionComponent, PublicacionformComponent]
})
export class FeedPage implements OnInit {

  public publicaciones: any[] | null = null;
  private paginaActual: number = 0;

  public isCreateOpen: boolean = false;

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
          p: this.paginaActual
        },
        successCallback: ( response: any ) => {
          if( this.publicaciones === null ) this.publicaciones = [];

          const responseBody: any = response.body;

          if( Array.isArray( responseBody.publicaciones ) === true ){
            const response = responseBody.publicaciones;

            for( let i = 0; i < response.length; ++i ){
              this.publicaciones.push( response[ i ] );
            }

            if( response.length > 0 ){
              ++this.paginaActual;
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

  redirigirNueva( id?: number ): void {
    if( id ){
      this.isCreateOpen = false;
      
      /**
       * INTENTAR REDIRIGIR DA EL SIGUIENTE ERROR:
       * 
       * El consumo de memoria will-change es demasiado alto
       * 
       * this.router.navigate( [ `/publicaciones/${id}` ] ); 
       * **/
    }
  }

  onIonInfinite( ev: any ) {
    this.getFeed();

    ( ev as InfiniteScrollCustomEvent ).target.complete();
  }

  toggleCrear( opened: boolean ): void {
    this.isCreateOpen = opened;
  }
}
