import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalidaPage } from './salida.page';

describe('SalidaPage', () => {
  let component: SalidaPage;
  let fixture: ComponentFixture<SalidaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SalidaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
