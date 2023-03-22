/**
 * MIDDLEWARE: Validadores
 */

// === IMPORTAR ===

// Librerias de terceros

// Propio
const { HTTP } = require( '../helpers/constantes.js' ); // Codigos de estado HTTP
const { logRequest } = require( '../helpers/log.js' );  // Registro

// ----------------


/**
 * Comprueba si el usuario es el propietario de un recurso o un administrador.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta del servidor.
 * @param {*} next Siguiente metodo a ejecutar.
 */
const validateSensitiveAccess = ( req , res , next ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = req.params.id;

    if( ( idSolicitante === idObjetivo ) || // Es propietario o
        ( req.user.isAdmin === true ) ){    // Es administrador
        next();
    } else {
        res.status( HTTP.error_client.forbidden ).json( {
            msg: 'No cuentas con los permisos necesarios para realizar esta acción'
        } );
        logRequest( req , 'validateSensitiveAccess' , HTTP.error_client.forbidden , 'El solicitante no es el propietario del recurso o un administrador' );
    }
}

// Marcar para exportar
module.exports = { validateSensitiveAccess }