import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hikin-itinerarioprev',
  templateUrl: './itinerarioprev.component.html',
  styleUrls: ['../commonStyle.scss','./itinerarioprev.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class ItinerarioprevComponent  implements OnInit {

  @Input() itinerario: any;

  constructor(){}

  ngOnInit(){
    switch( this.itinerario.dificultad ){
      case 1: this.itinerario.dificultadnombre = 'FÁCIL'; break;
      case 2: this.itinerario.dificultadnombre = 'MEDIA'; break;
      case 3: this.itinerario.dificultadnombre = 'DIFÍCIL'; break;

      default: this.itinerario.dificultadnombre = '-'; break;
    }

    if( this.itinerario.distancia ){
      this.itinerario.distanciakm = `${( this.itinerario.distancia / 1000 ).toFixed( 1 )} <abbr title="kilómetros">km</abbr>`;
    }

    if( this.itinerario.desnivel ){
      this.itinerario.desnivelm = `${this.itinerario.desnivel} <abbr title="metros">m</abbr>`;
    }
  }

}
