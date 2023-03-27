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
const cors      = require( 'cors' )                // CORS
const swaggerUI = require( 'swagger-ui-express' ); // Interfaz de usuario de Swagger para Express

// Propias
require( './services/database.js' );                           // Conexión con la base de datos
const { logRequest }   = require( './helpers/log.js' );        // Registros
const { HTTP , COLOR } = require( './helpers/constantes.js' ); // Abstraccion de constantes varias (colores de terminal, respuestas HTTP, etc)
const { RUTA , PUERTO , END_DOCS , PROTOCOLO } = require( './helpers/rutas.js' ); // Rutas parseadas

// -----------------

// === INICIALIZAR

// EXPRESS
const app = express();
app.use( express.json() );                           // Soporte para cuerpos codificados en JSON
app.use( express.urlencoded( { extended: true } ) ); // Soporte extendido para cuerpos codificados <---------------------------------------- REVISAR SI SE PUEDE QUITAR

// CORS
app.use( cors() );

// RUTAS
app.use( '/api/usuarios'      , require( './routes/usuarios.js'      ) );
app.use( '/api/publicaciones' , require( './routes/publicaciones.js' ) );
app.use( '/api/itinerarios'   , require( './routes/itinerarios.js'   ) );
app.use( '/api/clubes'        , require( './routes/clubes.js'        ) );
app.use( '/api/salidas'       , require( './routes/salidas.js'       ) );
app.use( '/api/info'          , require( './routes/info.js'          ) );
app.use( '/api/auth'          , require( './routes/auth.js'          ) );

// INTERFAZ DE SWAGGER
app.use( END_DOCS , swaggerUI.serve , swaggerUI.setup( require( './docs/openapi.json' ) ) );

// --------------------------------



// ===== SERVIDOR =====

// Establecer cabeceras en todas las peticiones como middleware
app.use( ( req , res , next ) => {
    // Aceptar peticiones de otro origen. Evita problemas con carga de recursos.
    res.header( 'Access-Control-Allow-Origin' , '*' );
    // Aceptar cabeceras adicionales
    res.header( 'Access-Control-Allow-Headers' ,
        'Authorization, Content-Type, Accept, Origin, X-Requested-With' );
    // Lista blanca de métodos HTTP aceptados
    res.header( 'Access-Control-Allow-Methods' , 'GET, POST, PUT, PATCH, DELETE' );

    next();
});

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

ESPECIFICACIÓN de la API: ${COLOR.texto.cian}${PROTOCOLO}://${RUTA}:${PUERTO}${END_DOCS}${COLOR.reset}


` );
});

/**
 * Endpoint de prueba.
 */
app.get( '/api/ping' , ( req , res ) => {
    // Enviar la respuesta con estado OK
    res.status( HTTP.success.ok ).type( 'text/plain' ).send( 'pong' );

    // Registrar la acción
    logRequest( req , 'ping' , HTTP.success.ok , 'pong' );
});

// ----------------------------