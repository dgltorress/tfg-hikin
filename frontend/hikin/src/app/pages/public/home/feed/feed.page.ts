import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponent } from 'src/app/components/explore-container/explore-container.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-feed',
  templateUrl: 'feed.page.html',
  styleUrls: ['feed.page.scss','../home.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent],
  providers: [ApiService]
})
export class FeedPage {
  constructor(
    private api: ApiService
  ){}

  testApi(){
    this.api.getUsuarios(
      {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJpc0FkbWluIjpmYWxzZX0sImlhdCI6MTY3OTU4Nzk4OCwiZXhwIjozMzIzNzE4Nzk4OH0.W-xkQDq_zSqJZxdYTQeAus0ppNKWgeSslgWthrAWmEw'
        },
        params: {
          lol: 'lolito'
        },
        successCallback: ( response: any ) => {
          console.log( 'ÉXITO', response );
          document.getElementById('main-content')?.lastElementChild?.insertAdjacentHTML( 'beforeend', JSON.stringify( response.body ) );
        },
        failedCallback: ( response: any ) => {
          console.error( 'ERROR', response );
        }
      }
    );
  }
}
