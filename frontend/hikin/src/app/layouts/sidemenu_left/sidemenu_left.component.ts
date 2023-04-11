import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-sidemenu-left',
  templateUrl: './sidemenu_left.component.html',
  styleUrls: ['./sidemenu_left.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive, CommonModule],
})
export class SidemenuLeftComponent implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);

  public sidemenuLeftPages = [
    { title: 'Perfil', url: '/home/feed', icon: 'person-circle' },
    { title: 'Opciones', url: '/home/salidas', icon: 'cog' },
    { title: 'Cerrar sesión', url: '/home/comunidad', icon: 'log-out' },
    { title: 'Acerca', url: '/home/itinerarios', icon: 'information-circle' }
  ];
  public sidemenuLeftPages2 = [
    { title: 'Desarrollador', url: '/login', icon: 'code' }
  ];

  constructor() {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }
}
