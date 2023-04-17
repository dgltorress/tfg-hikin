import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponent } from 'src/app/components/explore-container/explore-container.component';
import { ApiService } from 'src/app/services/api.service';

import { MainheaderComponent, SearchBars } from 'src/app/layouts/mainheader/mainheader.component';

@Component({
  selector: 'app-comunidad',
  templateUrl: 'comunidad.page.html',
  styleUrls: ['../../commonStyle.scss','../home.page.scss','comunidad.page.scss'],
  standalone: true,
  imports: [IonicModule, MainheaderComponent, ExploreContainerComponent]
})
export class ComunidadPage {

  public searchBars = SearchBars;

  constructor() {}
}
