import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

import { commonMethods } from 'src/app/components/commonMethods';

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

  public sidemenuLeftPages = [ {
    title: 'Opciones',
    url: '/settings',
    icon: 'cog'
  } ];

  public sidemenuLeftPages2 = [ {
    title: 'Acerca',
    url: '/about',
    icon: 'information-circle'
  } ];

  constructor(
    private authService: AuthService,
    public userService: UserService
  ){}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get( 'id' ) as string;

    if( this.userService.user ){
      this.sidemenuLeftPages.unshift( {
        title: 'Perfil',
        url: `/usuarios/${this.userService.user.id}`,
        icon: 'person-circle'
      } );
    }
  }

  logout(){
    this.authService.logout();
  }

  setDefaultPfp( ev: any ) : void { commonMethods.setDefaultPfp( ev ); }
}
