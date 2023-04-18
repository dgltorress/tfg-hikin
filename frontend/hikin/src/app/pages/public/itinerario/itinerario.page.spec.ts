import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItinerarioPage } from './itinerario.page';

describe('ItinerarioPage', () => {
  let component: ItinerarioPage;
  let fixture: ComponentFixture<ItinerarioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItinerarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
