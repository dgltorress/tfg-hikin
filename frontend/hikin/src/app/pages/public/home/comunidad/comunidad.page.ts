import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponent } from 'src/app/components/explore-container/explore-container.component';

@Component({
  selector: 'app-comunidad',
  templateUrl: 'comunidad.page.html',
  styleUrls: ['comunidad.page.scss','../home.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent],
})
export class ComunidadPage {
  constructor() {}
}
