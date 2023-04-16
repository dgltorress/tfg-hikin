import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { commonMethods } from '../commonMethods';

@Component({
  selector: 'app-hikin-comentario',
  templateUrl: './comentario.component.html',
  styleUrls: ['../commonStyle.scss','./comentario.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class ComentarioComponent implements OnInit {

  @Input() comentario: any;

  constructor(){}

  ngOnInit(){}

  setDefaultPfp( ev: any ) : void { commonMethods.setDefaultPfp( ev ) }
}
