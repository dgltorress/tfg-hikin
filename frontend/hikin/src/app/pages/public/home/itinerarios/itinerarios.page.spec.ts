import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../../../../components/explore-container/explore-container.component';

import { ItinerariosPage } from './itinerarios.page';

describe('ItinerariosPage', () => {
  let component: ItinerariosPage;
  let fixture: ComponentFixture<ItinerariosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItinerariosPage, IonicModule, ExploreContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItinerariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
