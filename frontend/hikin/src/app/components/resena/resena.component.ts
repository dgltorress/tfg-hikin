import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { commonMethods } from '../commonMethods';

@Component({
  selector: 'app-hikin-resena',
  templateUrl: './resena.component.html',
  styleUrls: ['../commonStyle.scss','./resena.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class ResenaComponent  implements OnInit {

  @Input() resena: any;

  public valoracion: number[] = Array( 0 );
  public resto: number[] = Array( 0 );

  constructor(){}

  ngOnInit(){
    this.valoracion = Array( this.resena.valoracion ).fill( 0 );
    this.resto = Array( 5 - this.resena.valoracion ).fill( 0 );

    this.resena.fecha = commonMethods.fechaISOALegible( this.resena.fecha );
  }

  setDefaultPfp( ev: any ) : void { commonMethods.setDefaultPfp( ev ); }
}
