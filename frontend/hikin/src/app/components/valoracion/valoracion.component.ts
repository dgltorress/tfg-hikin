import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hikin-valoracion',
  templateUrl: './valoracion.component.html',
  styleUrls: ['../commonStyle.scss','./valoracion.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class ValoracionComponent implements OnInit {

  @Input() valoracionUsuario: any;

  public valoracion: number[] = Array( 0 );
  public resto: number[] = Array( 0 );

  constructor(){}

  ngOnInit(){
    this.valoracion = Array( this.valoracionUsuario.valoracion ).fill( 0 );
    this.resto = Array( 5 - this.valoracionUsuario.valoracion ).fill( 0 );
  }

}
