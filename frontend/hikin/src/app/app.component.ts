import { Component, CUSTOM_ELEMENTS_SCHEMA, EnvironmentInjector } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  

  constructor(
    public environmentInjector: EnvironmentInjector
  ){}
}
