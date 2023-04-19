import { Component, OnInit, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AlertService } from 'src/app/services/alert.service';

import { DetailsheaderComponent } from 'src/app/layouts/detailsheader/detailsheader.component';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hikin-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, DetailsheaderComponent]
})
export class SettingsPage implements OnInit {

  public apiBaseUrl: string = '';
  public nightModeEnabled: boolean = false;

  constructor(
    private alertService: AlertService
  ){
  }

  ngOnInit(){
    this.apiBaseUrl = environment.apiBaseUrl;
    this.nightModeEnabled = window.matchMedia( '(prefers-color-scheme: dark)' ).matches;
  }

  updateApiBaseUrl( nuevaUrl: any ): void {
    if( nuevaUrl &&
        nuevaUrl.target &&
        nuevaUrl.target.value ){
        this.apiBaseUrl = nuevaUrl.target.value;
        environment.apiBaseUrl = this.apiBaseUrl;
        
        console.log('cambiada a ', this.apiBaseUrl,environment.apiBaseUrl);
    } else {
      if( isDevMode() === true ){
        console.warn( 'No se ha podido cambiar la URL de la API' );
      }
    }
  }

  toggleNightMode(): void {
    this.nightModeEnabled = !this.nightModeEnabled;

    document.body.classList.toggle( 'dark', this.nightModeEnabled );
  }

}
