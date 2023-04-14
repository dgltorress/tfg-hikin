import { Component, OnInit, Input, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hikin-publicacion',
  templateUrl: './publicacion.component.html',
  styleUrls: ['./publicacion.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class PublicacionComponent  implements OnInit {

  @Input() publicacion: any;

  private static readonly defaultImageSource: string = 'assets/img/bg-default.png';
  private static readonly defaultPfpSource: string = 'assets/img/user-default.png';

  constructor(){
    console.log( this.publicacion )
  }

  ngOnInit(){}

  setDefaultImage( ev: any ) : void {
    if( isDevMode() === true ){
      console.warn( `No se ha podido encontrar la imagen en la URL: ${ev.target.src}` );
    }
    
    if( ev && ev.target ){
      ev.target.src = PublicacionComponent.defaultImageSource;
    }
    else{
      if( isDevMode() === true ){
        console.error( 'No se ha devuelto un evento válido para situar la imagen por defecto: ' , ev );
      }
    }
  }

  setDefaultPfp( ev: any ) : void {
    if( isDevMode() === true ){
      console.warn( `No se ha podido encontrar la foto de perfil en la URL: ${ev.target.src}` );
    }
    
    if( ev && ev.target ){
      ev.target.src = PublicacionComponent.defaultPfpSource;
    }
    else{
      if( isDevMode() === true ){
        console.error( 'No se ha devuelto un evento válido para situar la foto de perfil por defecto: ' , ev );
      }
    }
  }
}
