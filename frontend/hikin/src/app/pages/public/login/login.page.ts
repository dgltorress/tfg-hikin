import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { UsuarioService } from 'src/app/services/usuario.service';
import { ApiService } from 'src/app/services/api.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService
  ){}

  ngOnInit(){
    this.activatedRoute.queryParamMap
      .subscribe( ( paramMap ) => {
        const caughtError: string | null = paramMap.get( 'err' );

        if( caughtError !== null ){
          const caughtErrorStatus: number = parseInt( caughtError );
          if( caughtErrorStatus === 401 ){
            this.alertService.presentToast( 'Error al autenticar', 1500, 'alert' );
          }
        }
        console.log( paramMap );
      }
    );
  }
}
