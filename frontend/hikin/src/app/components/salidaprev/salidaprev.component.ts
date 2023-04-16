import { Component, OnInit, Input, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hikin-salidaprev',
  templateUrl: './salidaprev.component.html',
  styleUrls: ['./salidaprev.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class SalidaprevComponent implements OnInit {

  @Input() salida: any;

  private static readonly defaultPfpSource: string = 'assets/img/user-default.png';

  constructor(){}

  ngOnInit(){}

  setDefaultPfp( ev: any ) : void {
    if( isDevMode() === true ){
      console.warn( `No se ha podido encontrar la foto de perfil en la URL: ${ev.target.src}` );
    }
    
    if( ev && ev.target ){
      ev.target.src = SalidaprevComponent.defaultPfpSource;
    }
    else{
      if( isDevMode() === true ){
        console.error( 'No se ha devuelto un evento válido para situar la foto de perfil por defecto: ' , ev );
      }
    }
  }
}
