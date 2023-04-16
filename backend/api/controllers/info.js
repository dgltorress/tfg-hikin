/**
 * CONTROLLER: Info
 */

// === IMPORTAR ===

// Librerias de terceros


// Propio
const { adminConnection } = require( '../services/database.js' ); // Base de datos
const { HTTP } = require( '../helpers/constantes.js' ); // Constantes
const { logRequest } = require( '../helpers/log.js' ); // Registro
const { resolveURL } = require( '../helpers/metodos.js' ); // Metodos generales
const { RUTAMASKFULL } = require( '../helpers/rutas.js' ); // Rutas

// ----------------


// === INICIALIZAR



// --------------------------------


// * ================== GET ======================

/**
 * Responde con las localidades de la base de datos.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
 const getLocalidades = async( req , res ) => {
    // Query
    adminConnection.query(
`SELECT l.id,
l.codauto, a.nombre AS nombreauto,
l.cpro, p.nombre AS nombrepro
FROM localidades AS l
INNER JOIN autonomias AS a ON l.codauto = a.cod
LEFT JOIN provincias AS p ON l.cpro = p.cod` ,
[] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'getLocalidades' , HTTP.error_server.internal , 'Error al obtener las localidades' );
            } else {
                res.status( HTTP.success.ok ).json( result );
                logRequest( req , 'getLocalidades', HTTP.success.ok );
            }
        }
    );
}

/**
 * Responde con las autonomías de la base de datos.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getAutonomias = async( req , res ) => {
    // Query
    adminConnection.query(
        'SELECT * FROM autonomias' ,
        [] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'getAutonomias' , HTTP.error_server.internal , 'Error al obtener las autonomías' );
            } else {
                res.status( HTTP.success.ok ).json( result );
                logRequest( req , 'getAutonomias', HTTP.success.ok );
            }
        }
    );
}

/**
 * Responde con las provincias de la base de datos.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getProvincias = async( req , res ) => {
    // Construye la consulta
    let sqlQuery = 'SELECT p.cod, p.nombre FROM provincias AS p';
    const parameters = [];

    if( req.query.codauto !== undefined ){
        sqlQuery += ' INNER JOIN localidades AS l ON p.cod = l.cpro WHERE l.codauto = ?';
        parameters.push( req.query.codauto );
    }

    // Query
    adminConnection.query(
        sqlQuery ,
        parameters ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'getProvincias' , HTTP.error_server.internal , 'Error al obtener las provincias' );
            } else {
                res.status( HTTP.success.ok ).json( result );
                logRequest( req , 'getProvincias', HTTP.success.ok );
            }
        }
    );
}

/**
 * Obtiene los distintivos que hay en la base de datos.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
 const getDistintivos = async( req , res ) => {
    // Distingue los identificadores
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
        'SELECT * FROM distintivos', [],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getDistintivos' , HTTP.error_server.internal , 'Error al obtener los recursos' );
            } else {
                // Resolver URLs de imágenes de distintivos
                for( let i = 0 ; i < result.length ; i++ ){
                    if( result[ i ].imagen ){
                        result[ i ].imagen = resolveURL( result[ i ].imagen , `${RUTAMASKFULL}/assets/img/distintivo/` , -4 );
                    }
                }

                res.status( HTTP.success.ok ).json( result );
                logRequest( req , 'getDistintivos' , HTTP.success.ok );
            }
        }
    );
}

// -----------------------------------------------






// Marcar los metodos para exportar
module.exports = { getLocalidades, getAutonomias, getProvincias, getDistintivos };