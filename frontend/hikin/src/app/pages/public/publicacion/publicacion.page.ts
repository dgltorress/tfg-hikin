import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';

import { DetailsheaderComponent } from 'src/app/layouts/detailsheader/detailsheader.component';
import { PublicacionComponent } from 'src/app/components/publicacion/publicacion.component';
import { ComentarioComponent } from 'src/app/components/comentario/comentario.component';

@Component({
  selector: 'app-hikin-publicacion-detalles',
  templateUrl: './publicacion.page.html',
  styleUrls: ['../commonStyle.scss','./publicacion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, DetailsheaderComponent, PublicacionComponent, ComentarioComponent]
})
export class PublicacionPage implements OnInit {

  public publicacion: any = null;
  public comentarios: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private alertService: AlertService
  ){}

  ngOnInit(){
    this.activatedRoute.paramMap.subscribe( ( params ) => {
      const idParam: string | null = params.get( 'id' );

      if( idParam !== null ){
        const id = parseInt( idParam );

        if( isNaN( id ) !== true ){
          this.getPublicacion( id );
          this.getComentarios( id );
        }
      }
    } );
  }

  getPublicacion( id: number ): void {
    this.api.getPublicacion( id, {
      successCallback: ( response: any ) => {
        this.publicacion = response.body;
      },
      failedCallback: ( errorResponse: any ) => {
        this.alertService.errorToToast( errorResponse.error );
      }
    } );
  }

  getComentarios( pubId: number ): void {
    this.api.getComentarios( pubId, {
      successCallback: ( response: any ) => {
        this.comentarios = response.body;
      },
      failedCallback: ( errorResponse: any ) => {
        this.alertService.errorToToast( errorResponse.error );
      }
    } );
  }
}
