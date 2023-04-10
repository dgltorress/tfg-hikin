import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SidemenuRightComponent } from './sidemenu_right.component';

describe('SidemenuRightComponent', () => {
  let component: SidemenuRightComponent;
  let fixture: ComponentFixture<SidemenuRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidemenuRightComponent, IonicModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SidemenuRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
