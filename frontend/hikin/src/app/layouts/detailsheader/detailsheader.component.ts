import { Component, OnInit, Input } from '@angular/core';
import { IonicModule, Animation, createAnimation } from '@ionic/angular';

@Component({
  selector: 'app-hikin-detailsheader',
  templateUrl: './detailsheader.component.html',
  styleUrls: ['./detailsheader.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class DetailsheaderComponent implements OnInit {

  @Input() titulo: string = 'Recurso';

  //private static readonly animationEffect: AnimationEffect = ;
  //private static readonly animationTimeline: AnimationTimeline = ;

  constructor() { }

  ngOnInit() {}

  animateBack(
    baseEl: any,
    opts?: any
  ): Animation {
    return createAnimation();
  }
}
