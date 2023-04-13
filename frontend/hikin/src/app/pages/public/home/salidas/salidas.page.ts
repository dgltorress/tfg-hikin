import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponent } from 'src/app/components/explore-container/explore-container.component';
import { ApiService } from 'src/app/services/api.service';

import { MainheaderComponent, SearchBars } from 'src/app/layouts/mainheader/mainheader.component';

@Component({
  selector: 'app-salidas',
  templateUrl: 'salidas.page.html',
  styleUrls: ['salidas.page.scss','../home.page.scss'],
  standalone: true,
  imports: [IonicModule, MainheaderComponent, ExploreContainerComponent]
})
export class SalidasPage {

  public searchBars = SearchBars;

  constructor(
    private api: ApiService
  ){}

  
}
