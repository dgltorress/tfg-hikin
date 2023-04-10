import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  public tabContents = [
    { title: '', url: 'feed', icon: 'triangle' },
    { title: '', url: 'salidas', icon: 'ellipse' },
    { title: '', url: 'comunidad', icon: 'square' },
    { title: '', url: 'itinerarios', icon: 'book' }
  ];

  constructor() {}
}
