import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DetailsheaderComponent } from 'src/app/layouts/detailsheader/detailsheader.component';

@Component({
  selector: 'app-hikin-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, DetailsheaderComponent]
})
export class AboutPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
