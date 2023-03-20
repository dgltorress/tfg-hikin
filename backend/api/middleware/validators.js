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
 * Comprueba si el usuario es administrador mirando el objeto `req`.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta del servidor.
 * @param {*} next Siguiente metodo a ejecutar.
 */
const validateAdmin = ( req , res , next ) => {
    if( req.user &&
        req.user.isAdmin &&
        ( req.user.isAdmin === true ) ){
        next();
    } else {
        res.status( HTTP.error_client.forbidden ).json( {
            msg: 'El solicitante no cuenta con los permisos necesarios'
        } );
        logRequest( req , 'validateAdmin' , HTTP.error_client.forbidden , 'El solicitante no es administrador' );
    }
}

// Marcar para exportar
module.exports = { validateAdmin }