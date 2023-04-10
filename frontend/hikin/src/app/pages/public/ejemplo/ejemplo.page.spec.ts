import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../../../components/explore-container/explore-container.component';

import { EjemploPage } from './ejemplo.page';

describe('EjemploPage', () => {
  let component: EjemploPage;
  let fixture: ComponentFixture<EjemploPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjemploPage, IonicModule, ExploreContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EjemploPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
