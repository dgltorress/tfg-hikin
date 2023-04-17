import { Component, OnInit, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-hikin-detailsheader',
  templateUrl: './detailsheader.component.html',
  styleUrls: ['./detailsheader.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class DetailsheaderComponent implements OnInit {

  @Input() titulo: string = 'Recurso';

  constructor() { }

  ngOnInit() {}

}
