import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { commonMethods } from '../commonMethods';

@Component({
  selector: 'app-hikin-distintivo',
  templateUrl: './distintivo.component.html',
  styleUrls: ['../commonStyle.scss','./distintivo.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class DistintivoComponent  implements OnInit {

  @Input() distintivo: any;
  @Input() bloqueado: boolean = true;

  constructor(){}

  ngOnInit(){
  }

  setDefaultDistintivo( ev: any ): void { commonMethods.setDefaultDistintivo( ev ); }

}
