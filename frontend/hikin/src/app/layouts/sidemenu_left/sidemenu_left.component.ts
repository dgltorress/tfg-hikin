import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';

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
    { title: 'COMUNIDAD', url: '/home/comunidad', icon: 'log-in' }
  ];
  public sidemenuLeftPages2 = [
    { title: 'Acerca', url: '/home/itinerarios', icon: 'information-circle' },
    { title: 'Desarrollador', url: '/login', icon: 'code' }
  ];

  constructor(
    private authService: AuthService
  ){}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  logout(){
    this.authService.logout();
  }
}
