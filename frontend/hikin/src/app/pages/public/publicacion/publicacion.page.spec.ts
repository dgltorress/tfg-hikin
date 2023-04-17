import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicacionPage } from './publicacion.page';

describe('PublicacionPage', () => {
  let component: PublicacionPage;
  let fixture: ComponentFixture<PublicacionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PublicacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
