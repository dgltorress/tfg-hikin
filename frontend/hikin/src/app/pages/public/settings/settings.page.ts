import { Component, OnInit, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AlertService } from 'src/app/services/alert.service';

import { DetailsheaderComponent } from 'src/app/layouts/detailsheader/detailsheader.component';

import { environment } from 'src/environments/environment';
import { environment as environmentProd } from 'src/environments/environment.prod';

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
    if( isDevMode() === true ){
      this.apiBaseUrl = environment.apiBaseUrl;
      this.nightModeEnabled = environment.nightModeEnabled;
    } else {
      this.apiBaseUrl = environmentProd.apiBaseUrl;
      this.nightModeEnabled = environmentProd.nightModeEnabled;
    }
  }

  ngOnInit(){
  }

  updateApiBaseUrl( nuevaUrl: string ): void {
    this.apiBaseUrl = nuevaUrl;

    if( isDevMode() === true ){
      environment.apiBaseUrl = this.apiBaseUrl;
    } else {
      environmentProd.apiBaseUrl = this.apiBaseUrl;
    }
  }

  toggleNightMode( isEnabled: boolean ){
    this.nightModeEnabled = isEnabled;

    if( isDevMode() === true ){
      environment.nightModeEnabled = this.nightModeEnabled;
    } else {
      environmentProd.nightModeEnabled = this.nightModeEnabled;
    }
  }

}
