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

  public resenas: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private alertService: AlertService,
    private userService: UserService,
  ){}

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

  setSegment( ev: any ): void {
    this.currentSegment = ev.target.value;
  }
}
