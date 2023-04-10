import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponent } from '../../../../components/explore-container/explore-container.component';

import { SalidasPage } from './salidas.page';

describe('SalidasPage', () => {
  let component: SalidasPage;
  let fixture: ComponentFixture<SalidasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalidasPage, IonicModule, ExploreContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SalidasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
