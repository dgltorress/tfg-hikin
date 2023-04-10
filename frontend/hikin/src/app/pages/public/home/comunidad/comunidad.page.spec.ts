import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../../../../components/explore-container/explore-container.component';

import { ComunidadPage } from './comunidad.page';

describe('ComunidadPage', () => {
  let component: ComunidadPage;
  let fixture: ComponentFixture<ComunidadPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComunidadPage, IonicModule, ExploreContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComunidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
