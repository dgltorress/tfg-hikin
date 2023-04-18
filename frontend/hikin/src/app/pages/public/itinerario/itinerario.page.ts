import { Component, OnInit, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, ActivatedRoute } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';

import { DetailsheaderComponent } from 'src/app/layouts/detailsheader/detailsheader.component';
import { ItinerarioComponent } from 'src/app/components/itinerario/itinerario.component';
import { ResenaComponent } from 'src/app/components/resena/resena.component';

@Component({
  selector: 'app-hikin-itinerario-detalles',
  templateUrl: './itinerario.page.html',
  styleUrls: ['../commonStyle.scss','./itinerario.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, DetailsheaderComponent, ItinerarioComponent, ResenaComponent]
})
export class ItinerarioPage implements OnInit {

  public currentSegment: string = 'detalles';

  public itinerario: any = null;

  public resenaPropia: any = null;
  public resenas: any[] = [];

  // Formularios y controles
  publicarResenaForm: FormGroup;

  publicarResenaValoracionControl: FormControl;
  publicarResenaObservacionesControl: FormControl;

  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private alertService: AlertService,
    private userService: UserService,
  ){
    this.publicarResenaValoracionControl = new FormControl();
    this.publicarResenaObservacionesControl = new FormControl();

    this.publicarResenaForm = new FormGroup( {
      valoracion: this.publicarResenaValoracionControl,
      observaciones: this.publicarResenaObservacionesControl
    } );
  }

  ngOnInit(){
    this.activatedRoute.paramMap.subscribe( ( params ) => {
      const idParam: string | null = params.get( 'id' );

      if( idParam !== null ){
        const id = parseInt( idParam );

        if( isNaN( id ) !== true ){
          this.getItinerario( id );
          this.getResenas( id );
        }
      }
    } );
  }

  getItinerario( id: number ): void {
    this.api.getItinerario( id , {
      successCallback: ( response: any ) => {
        this.itinerario = response.body;
      },
      failedCallback: ( errorResponse: any ) => {
        this.alertService.errorToToast( errorResponse.error );
      }
    } );
  }

  getResenas( itId: number ): void {
    this.api.getItinerarioResenas( itId , {
      successCallback: ( response: any ) => {
        this.resenas = response.body;
      },
      failedCallback: ( errorResponse: any ) => {
        this.alertService.errorToToast( errorResponse.error );
      }
    } );
  }

  publicarResena(): void {
    try{
      const formValues = this.publicarResenaForm.value;
      if( formValues.valoracion ){
        const requestBody: any = {
          valoracion: formValues.valoracion
        };

        if( formValues.observaciones ){
          requestBody.observaciones = formValues.observaciones;
        }

        this.api.subirItinerarioResenas( this.itinerario.id , {
          body: requestBody,
          successCallback: ( response: any ) => {
            this.publicarResenaValoracionControl.reset();
            this.publicarResenaObservacionesControl.reset();

            const resenaPublicada = response.body;
            resenaPublicada.autorimagen = this.userService.user.imagen;
            resenaPublicada.autornombre = this.userService.user.usuario;

            this.resenaPropia = resenaPublicada;
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

  eliminarResena( ev: any ): void {
    this.resenaPropia = null;

    for( let i = 0 ; i < this.resenas.length ; ++i ){
      if( this.resenas[ i ].usuario === ev ){
        this.resenas.splice( i, 1 );
        break;
      }
    }
  }

  setSegment( ev: any ): void {
    this.currentSegment = ev.target.value;
  }
}
