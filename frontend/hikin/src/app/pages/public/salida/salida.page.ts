import { Component, OnInit, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, ActivatedRoute } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';

import { DetailsheaderComponent } from 'src/app/layouts/detailsheader/detailsheader.component';
import { SalidaComponent } from 'src/app/components/salida/salida.component';
import { UsuarioprevComponent } from 'src/app/components/usuarioprev/usuarioprev.component';

@Component({
  selector: 'app-hikin-salida-detalles',
  templateUrl: './salida.page.html',
  styleUrls: ['../commonStyle.scss','./salida.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterModule,
    DetailsheaderComponent, SalidaComponent, UsuarioprevComponent]
})
export class SalidaPage implements OnInit {

  public currentSegment: string = 'detalles';

  public salida: any = null;

  public participantes: any[] = [];

  public valoraciones: {
    participante: any,
    formulario: FormGroup
  }[] = [];

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

        for( let i = 0 ; i < this.participantes.length ; ++i ){
          const actual = this.participantes[ i ];
          if( this.userService.user.id !== actual.id ){
            this.valoraciones.push( {
              participante: actual,
              formulario: new FormGroup( {
                valorado: new FormControl( actual.id ),
                acude: new FormControl(),
                valoracion: new FormControl(),
                observaciones: new FormControl()
              } )
            } );
          }
        }
      },
      failedCallback: ( errorResponse: any ) => {
        this.alertService.errorToToast( errorResponse.error );
      }
    } );
  }

  subirValoraciones(): void {
    const valoresFormularios: any[] = [];

    for( let i = 0 ; i < this.valoraciones.length ; ++i ){
      const valoresActuales = this.valoraciones[ i ].formulario.value;

      Object.keys( valoresActuales ).forEach( ( key ) => {
        const param = valoresActuales[ key ];
  
        if( ( param === null ) ||
            ( param === '' ) ){
          delete valoresActuales[ key ];
        }
      } );

      valoresFormularios.push( valoresActuales );
    }


    this.api.valorarSalida( this.salida.id , {
      body: valoresFormularios,
      successCallback: ( response: any ) => {
        this.alertService.showToast( 'Valoraciones subidas' );
        this.currentSegment = 'detalles';
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
