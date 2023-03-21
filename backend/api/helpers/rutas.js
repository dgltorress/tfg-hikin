/**
 * HELPER: Rutas procesadas de .env
 */

let tempPort = parseInt( process.env.PORT );

const RUTA      = ( process.env.URL && process.env.URL !== '' ) ? process.env.URL : '127.0.0.1';
const PUERTO    = ( process.env.PORT && !isNaN( tempPort ) ) ? tempPort : 3000 ;
const END_DOCS  = ( process.env.DOCS_ENDPOINT && process.env.DOCS_ENDPOINT !== '' ) ? process.env.DOCS_ENDPOINT : '/api/docs';
const PROTOCOLO = ( process.env.HTTPS_ENABLED && ( parseInt( process.env.HTTPS_ENABLED ) === 1 ) ) ? 'https' : 'http' ;

const RUTAFULL = `${PROTOCOLO}://${RUTA}:${PUERTO}`;
const RUTAAPI = `${RUTAFULL}/api`;

const RUTAMASK = ( process.env.URL_MASK && process.env.URL_MASK !== '' ) ? process.env.URL_MASK : 'localhost';
const RUTAMASKFULL = `${PROTOCOLO}://${RUTAMASK}`;
const RUTAAPIMASK = `${RUTAMASK}/api`;

module.exports = { RUTA , PUERTO , END_DOCS , PROTOCOLO , RUTAFULL , RUTAAPI ,
    RUTAMASK , RUTAMASKFULL , RUTAAPIMASK }