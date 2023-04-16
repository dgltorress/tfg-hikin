import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { commonMethods } from '../commonMethods';

@Component({
  selector: 'app-resena',
  templateUrl: './resena.component.html',
  styleUrls: ['../commonStyle.scss','./resena.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class ResenaComponent  implements OnInit {

  @Input() resena: any;

  public valoracion: number[] = Array( 0 ).fill( 0 );
  public resto: number[] = Array( 0 ).fill( 0 );

  constructor() { }

  ngOnInit() {}

  setDefaultPfp( ev: any ) : void { commonMethods.setDefaultPfp( ev ) }
}
