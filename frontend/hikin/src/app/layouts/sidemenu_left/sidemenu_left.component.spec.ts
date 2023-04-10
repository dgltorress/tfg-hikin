import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SidemenuLeftComponent } from './sidemenu_left.component';

describe('SidemenuLeftComponent', () => {
  let component: SidemenuLeftComponent;
  let fixture: ComponentFixture<SidemenuLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidemenuLeftComponent, IonicModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SidemenuLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
