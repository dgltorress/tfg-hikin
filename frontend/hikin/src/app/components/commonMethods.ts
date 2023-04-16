import { isDevMode } from '@angular/core';

const defaultImageSource: string = 'assets/img/bg-default-black.png';
const defaultPfpSource: string = 'assets/img/user-default.png';
const defaultClubSource: string = 'assets/img/bg-default.png';

export const commonMethods = {
    setDefaultImage: ( ev: any ): void => {
        if( isDevMode() === true ){
          console.warn( `No se ha podido encontrar la imagen en la URL: ${ev.target.src}` );
        }

        if( ev && ev.target ){
          ev.target.src = defaultImageSource;
        }
        else{
          if( isDevMode() === true ){
            console.error( 'No se ha devuelto un evento válido para situar la imagen por defecto: ' , ev );
          }
        }
    },
    setDefaultPfp: ( ev: any ): void => {
      if( isDevMode() === true ){
        console.warn( `No se ha podido encontrar la foto de perfil en la URL: ${ev.target.src}` );
      }
      
      if( ev && ev.target ){
        ev.target.src = defaultPfpSource;
      }
      else{
        if( isDevMode() === true ){
          console.error( 'No se ha devuelto un evento válido para situar la foto de perfil por defecto: ' , ev );
        }
      }
    },
    setDefaultClub: ( ev: any ): void => {
      if( isDevMode() === true ){
        console.warn( `No se ha podido encontrar la foto de club en la URL: ${ev.target.src}` );
      }
      
      if( ev && ev.target ){
        ev.target.src = defaultClubSource;
      }
      else{
        if( isDevMode() === true ){
          console.error( 'No se ha devuelto un evento válido para situar la foto de club por defecto: ' , ev );
        }
      }
    }
};