import { Component, OnInit, Input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-hikin-embedmap',
  templateUrl: './embedmap.component.html',
  styleUrls: ['./embedmap.component.scss'],
  standalone: true,
  imports: []
})
export class EmbedmapComponent  implements OnInit {

  @Input() source?: SafeResourceUrl;

  constructor(){}

  ngOnInit(){}

}
