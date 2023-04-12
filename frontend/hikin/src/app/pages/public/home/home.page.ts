import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { SidemenuLeftComponent } from 'src/app/layouts/sidemenu_left/sidemenu_left.component';
import { SidemenuRightComponent } from 'src/app/layouts/sidemenu_right/sidemenu_right.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, SidemenuLeftComponent, SidemenuRightComponent],
})
export class HomePage {
  public environmentInjector = inject(EnvironmentInjector);

  public tabContents = [
    { title: '', url: 'feed', icon: 'triangle' },
    { title: '', url: 'salidas', icon: 'ellipse' },
    { title: '', url: 'comunidad', icon: 'square' },
    { title: '', url: 'itinerarios', icon: 'book' }
  ];

  constructor() {}
}
