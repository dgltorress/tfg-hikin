import { Component, OnInit, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ApiService } from 'src/app/services/api.service';

import { DetailsheaderComponent } from 'src/app/layouts/detailsheader/detailsheader.component';

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
    private apiService: ApiService
  ){
  }

  ngOnInit(){
    this.apiBaseUrl = this.apiService.getApiBaseUrl();
    this.nightModeEnabled = window.matchMedia( '(prefers-color-scheme: dark)' ).matches;
  }

  updateApiBaseUrl( nuevaUrl: any ): void {
    if( nuevaUrl &&
        nuevaUrl.target &&
        nuevaUrl.target.value ){
        this.apiBaseUrl = nuevaUrl.target.value;
        this.apiService.setApiBaseUrl( this.apiBaseUrl );
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
