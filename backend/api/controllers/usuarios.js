/**
 * CONTROLLER: USER
 */

// === IMPORTAR ===

// Librerias de terceros
const bcrypt = require( 'bcrypt' ); // BcryptJS
const { toLong } = require( 'ip' ); // Pasar IPs a version entera

// Propio
const { adminConnection } = require( '../services/database.js' ); // Base de datos
const { COLOR , HTTP , textRegExEsp } = require( '../helpers/constantes.js' ); // Constantes
const { getIp , filterQueries , toUniversalPath, universalPathSeparator } = require( '../helpers/metodos.js' ); // Metodos generales
const { logRequest } = require( '../helpers/log.js' ); // Registro
const { generateJWT , JWTExpire } = require( '../helpers/jwt' ); // Generador de JSON Web Token
const { RUTAMASKFULL } = require( '../helpers/rutas.js' ); // Rutas

// ----------------



// * ================== GET ======================

const getUsuarios = async( req , res ) => {
    adminConnection.query(
        'SELECT * FROM usuarios' , {} ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Error al obtener los usuarios'
                } );
                logRequest( req , 'getUsuarios' , HTTP.error_server.internal , 'Error al obtener los usuarios' );
            } else {
                res.status( HTTP.success.ok ).json( {
                    usuarios: result,
                    paginado: {
                        actual: 1,
                        total: 1
                    }
                } );
                logRequest( req , 'getUsuarios', HTTP.success.ok );
            }
        }
    );
}

// -----------------------------------------------


// * ================== POST =====================



// -----------------------------------------------



// * ================== PUT ======================



// -----------------------------------------------


// * ================= PATCH =====================



// -----------------------------------------------


// * ================= DELETE ====================



// -----------------------------------------------






// Marcar los metodos para exportar
module.exports = { getUsuarios };