import { Component, OnInit, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';

import { DetailsheaderComponent } from 'src/app/layouts/detailsheader/detailsheader.component';
import { PublicacionComponent } from 'src/app/components/publicacion/publicacion.component';
import { ComentarioComponent } from 'src/app/components/comentario/comentario.component';

@Component({
  selector: 'app-hikin-publicacion-detalles',
  templateUrl: './publicacion.page.html',
  styleUrls: ['../commonStyle.scss','./publicacion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, DetailsheaderComponent, PublicacionComponent, ComentarioComponent]
})
export class PublicacionPage implements OnInit {

  public publicacion: any = null;

  public comentariosPropios: any[] = [];
  public comentarios: any[] = [];

  // Formularios y controles
  publicarComentarioForm: FormGroup;

  publicarComentarioControl: FormControl;

  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private alertService: AlertService,
    private userService: UserService
  ){
    this.publicarComentarioControl = new FormControl();

    this.publicarComentarioForm = new FormGroup( {
      texto: this.publicarComentarioControl
    } );
  }

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
    this.api.getPublicacion( id , {
      successCallback: ( response: any ) => {
        this.publicacion = response.body;
      },
      failedCallback: ( errorResponse: any ) => {
        this.alertService.errorToToast( errorResponse.error );
      }
    } );
  }

  getComentarios( pubId: number ): void {
    this.api.getComentarios( pubId , {
      successCallback: ( response: any ) => {
        this.comentarios = response.body;
      },
      failedCallback: ( errorResponse: any ) => {
        this.alertService.errorToToast( errorResponse.error );
      }
    } );
  }

  publicarComentario(): void {
    try{
      if( this.publicarComentarioForm.value.texto ){
        this.api.createComentario( this.publicacion.id , {
          body: {
            texto: this.publicarComentarioForm.value.texto
          },
          successCallback: ( response: any ) => {
            this.publicarComentarioControl.reset();

            const comentarioPublicado = response.body;
            comentarioPublicado.autorimagen = this.userService.user.imagen;
            comentarioPublicado.autornombre = this.userService.user.usuario;

            this.comentariosPropios.unshift( comentarioPublicado );
            ++this.publicacion.n_comentarios;
          },
          failedCallback: ( errorResponse: any ) => {
            this.alertService.errorToToast( errorResponse.error );
          }
        } );
      }
    } catch( err ){
      this.alertService.showToast( 'Ha habido un error' );
      if( isDevMode() === true ){ console.error( 'ERROR al publicar el comentario: ' , err ) }
    }
  }
}
