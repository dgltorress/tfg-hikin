import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../../../components/explore-container/explore-container.component';

@Component({
  selector: 'app-ejemplo',
  templateUrl: 'ejemplo.page.html',
  styleUrls: ['ejemplo.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent],
})
export class EjemploPage {
  constructor() {}
}
