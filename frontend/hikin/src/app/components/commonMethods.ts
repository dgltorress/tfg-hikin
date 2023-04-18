import { isDevMode } from '@angular/core';

const defaultImageSource: string = 'assets/img/bg-default-black.png';
const defaultPfpSource: string = 'assets/img/user-default.png';
const defaultClubSource: string = 'assets/img/bg-default.png';
const defaultDistintivoSource: string = 'assets/img/badge-default.png';

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
    },
    setDefaultDistintivo: ( ev: any ): void => {
      if( isDevMode() === true ){
        console.warn( `No se ha podido encontrar la foto de distintivo en la URL: ${ev.target.src}` );
      }
      
      if( ev && ev.target ){
        ev.target.src = defaultDistintivoSource;
      }
      else{
        if( isDevMode() === true ){
          console.error( 'No se ha devuelto un evento válido para situar la foto de distintivo por defecto: ' , ev );
        }
      }
    },

    /**
     * Para pasar de string ISO a legible.
     * 
     * Más información en https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
     * 
     * @param fecha Fecha como cadena en formato ISO.
     * @param locale 
     * @param dateStyle 
     * @param timeStyle 
     * 
     * @returns Fecha procesada o la misma si ha habido errores.
     */
    fechaISOALegible: (
      fecha: string,
      locale: string = 'es',
      dateStyle: 'full' | 'long' | 'medium' | 'short' = 'medium',
      timeStyle: 'full' | 'long' | 'medium' | 'short' = 'short',
    ): string => {
      if( fecha ){
        try{
          return new Intl.DateTimeFormat( locale, {
            dateStyle: dateStyle, timeStyle: timeStyle
          } ).format( new Date( fecha ) );
        } catch( err ){
          if( isDevMode() === true ) console.warn( '[getFeed()] ERROR al traducir la fecha: ', err );
        }
      }
      
      return fecha;
    }
};