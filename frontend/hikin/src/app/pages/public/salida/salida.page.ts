import { Component, OnInit, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';

import { DetailsheaderComponent } from 'src/app/layouts/detailsheader/detailsheader.component';
import { SalidaprevComponent } from 'src/app/components/salidaprev/salidaprev.component';
import { UsuarioprevComponent } from 'src/app/components/usuarioprev/usuarioprev.component';

@Component({
  selector: 'app-salida',
  templateUrl: './salida.page.html',
  styleUrls: ['./salida.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, DetailsheaderComponent, SalidaprevComponent, UsuarioprevComponent]
})
export class SalidaPage implements OnInit {

  public currentSegment: string = 'detalles';

  public salida: any = null;

  public participantes: any[] = [];

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
          this.getSalida( id );
          this.getParticipantes( id );
        }
      }
    } );
  }

  getSalida( id: number ): void {
    this.api.getSalida( id , {
      successCallback: ( response: any ) => {
        this.salida = response.body;
      },
      failedCallback: ( errorResponse: any ) => {
        this.alertService.errorToToast( errorResponse.error );
      }
    } );
  }

  getParticipantes( salId: number ): void {
    this.api.getSalidaParticipantes( salId , {
      successCallback: ( response: any ) => {
        this.participantes = response.body;
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
