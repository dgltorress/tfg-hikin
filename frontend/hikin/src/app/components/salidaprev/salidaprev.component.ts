import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { commonMethods } from '../commonMethods';

@Component({
  selector: 'app-hikin-salidaprev',
  templateUrl: './salidaprev.component.html',
  styleUrls: ['../commonStyle.scss','./salidaprev.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class SalidaprevComponent implements OnInit {

  @Input() salida: any;

  constructor(){}

  ngOnInit(){
    this.salida.fecha_inicio = commonMethods.fechaISOALegible( this.salida.fecha_inicio, 'es', 'long', 'short' );
    this.salida.fecha_fin = commonMethods.fechaISOALegible( this.salida.fecha_fin, 'es', 'long', 'short' );
  }

  setDefaultPfp( ev: any ) : void { commonMethods.setDefaultPfp( ev ); }
}
