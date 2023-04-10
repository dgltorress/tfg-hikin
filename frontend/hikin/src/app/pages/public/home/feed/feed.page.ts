import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../../../../components/explore-container/explore-container.component';

@Component({
  selector: 'app-feed',
  templateUrl: 'feed.page.html',
  styleUrls: ['feed.page.scss','../home.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent],
})
export class FeedPage {
  constructor() {}
}
