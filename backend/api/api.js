/****************************************************************************************

    API REST de HikIn (api.js)

*****************************************************************************************/

'use strict'; // Mejor prevenir que curar.

// ===== LIBRERÍAS REQUERIDAS =====

// === IMPORTAR ===

// Generales
require( 'dotenv' ).config( { // Variables de entorno
    path: `${__dirname}/.env`
} );

const express   = require( 'express' );            // Express
const swaggerUI = require( 'swagger-ui-express' ); // Interfaz de usuario de Swagger para Express

// Propias
require( './services/database.js' );                              // Conexión con la base de datos
const { logRequest }      = require( './helpers/log.js' );        // Registros
const { HTTP , COLOR }    = require( './helpers/constantes.js' ); // Abstraccion de constantes varias (colores de terminal, respuestas HTTP, etc)
const { RUTA , PUERTO , END_DOCS , PROTOCOLO } = require( './helpers/rutas.js' ); // Rutas parseadas

// -----------------

// === INICIALIZAR

// EXPRESS
const app = express();
app.use( express.json() );                           // Soporte para cuerpos codificados en JSON
app.use( express.urlencoded( { extended: true } ) ); // Soporte extendido para cuerpos codificados

// RUTAS
app.use( '/api/usuarios' , require( './routes/usuarios.js' ) );

// INTERFAZ DE SWAGGER
app.use( END_DOCS , swaggerUI.serve , swaggerUI.setup( './docs/openapi.json' ) );

// --------------------------------



// ===== SERVIDOR =====

// Poner en escucha
app.listen( PUERTO , RUTA , () => {
    // Mensaje de bienvenida
    console.log( `

${COLOR.fondo.blanco}                                                                         ${COLOR.reset}

   ${COLOR.texto.amarillo}API REST${COLOR.reset} (api.js)

   API y ESPECIFICACIÓN para ${COLOR.texto.magenta}HikIn${COLOR.reset}
_________________________________________________________________________

   TFG para el Grado en INGENIERÍA MULTIMEDIA de la Universidad de Alicante

${COLOR.fondo.blanco}                                                                         ${COLOR.reset}

${COLOR.texto.verde}API escuchando en:${COLOR.reset} ${COLOR.texto.cian}${PROTOCOLO}://${RUTA}:${PUERTO}${COLOR.reset}

ESPECIFICACION de la API: ${COLOR.texto.cian}${PROTOCOLO}://${RUTA}:${PUERTO}${END_DOCS}${COLOR.reset}


` );
});

/**
 * Endpoint de prueba.
 */
app.get( '/api/ping' , ( req , res ) => {
    // Cabecera Content-type: text/plain
    res.type( 'text/plain' );
    // Enviar la respuesta con estado OK
    res.status( HTTP.success.ok ).send( 'pong' );
    // Registrar la acción.
    logRequest( req , 'ping' , HTTP.success.ok , 'pong' );
});

// ----------------------------