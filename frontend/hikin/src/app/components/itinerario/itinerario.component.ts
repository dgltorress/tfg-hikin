import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-hikin-itinerario',
  templateUrl: './itinerario.component.html',
  styleUrls: ['../commonStyle.scss','./itinerario.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class ItinerarioComponent implements OnInit {

  @Input() itinerario: any;

  constructor(
    private domSanitizer: DomSanitizer
  ){}

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

    if( this.itinerario.tiempo ){
      this.itinerario.tiempoh = `${( this.itinerario.tiempo / 60 ).toFixed( 1 )} <abbr title="horas">h</abbr>`;
    }

    if( this.itinerario.circular === 0 ){
      this.itinerario.circular = 'NO';
    } else if( this.itinerario.circular === 1 ){
      this.itinerario.circular = 'SÍ';
    } else {
      this.itinerario.circular = '-';
    }

    if( this.itinerario.latitud && this.itinerario.longitud ){
      this.itinerario.openmapsrc = this.domSanitizer.bypassSecurityTrustResourceUrl( encodeURI(
        `https://www.openstreetmap.org/export/embed.html?bbox=${this.itinerario.longitud},${this.itinerario.latitud},${this.itinerario.longitud},${this.itinerario.latitud}&layer=mapnik'`
      ) );
      this.itinerario.googlemapssrc = this.domSanitizer.bypassSecurityTrustResourceUrl( encodeURI(
        `https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3037.8736815332227!2d${this.itinerario.latitud}!3d${this.itinerario.longitud}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDDCsDI0JzQxLjkiTiAxwrAyNSc1Ni45Ilc!5e0!3m2!1ses!2ses!4v1681785922292!5m2!1ses!2ses`
      ) );
      console.log(this.itinerario.openmapsrc);
      console.log(this.itinerario.googlemapssrc);
    }
  }

}
