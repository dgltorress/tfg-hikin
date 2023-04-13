import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-hikin-mainheader',
  templateUrl: './mainheader.component.html',
  styleUrls: ['./mainheader.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MainheaderComponent implements OnInit {

  @Input() search?: number;

  public searchBars = SearchBars;

  private fetchedLocations: boolean = false;

  constructor(
    private api: ApiService
  ){

  }

  ngOnInit(){
    
  }

}


export enum SearchBars {
  Salidas = 1,
  Comunidad = 2,
  Itinerarios = 3
}
