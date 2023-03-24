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
 * Comprueba si es el propio usuario o un administrador el que quiere realizar una acción sobre sí mismo.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta del servidor.
 * @param {*} next Siguiente metodo a ejecutar.
 */
const validateSensitiveActionUser = ( req , res , next ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = parseInt( req.params.id );

    if( ( idSolicitante === idObjetivo ) || // Es él mismo o
        ( req.user.isAdmin === true ) ){    // es administrador
        next();
    } else {
        res.status( HTTP.error_client.forbidden ).json( { msg: 'No cuentas con los permisos necesarios para realizar esta acción' } );
        logRequest( req , 'validateSensitiveActionUser' , HTTP.error_client.forbidden , 'El solicitante no es el propietario del recurso o un administrador' );
    }
}

/**
 * Comprueba si el usuario es el propietario de un recurso o un administrador.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta del servidor.
 * @param {*} next Siguiente metodo a ejecutar.
 */
 const validateNotSelf = ( req , res , next ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = parseInt( req.params.id );

    if( idSolicitante === idObjetivo ){
        res.status( HTTP.error_client.forbidden ).json( { msg: 'No puedes realizar esta acción sobre ti mismo' } );
        logRequest( req , 'validateNotSelf' , HTTP.error_client.forbidden , 'No puedes realizar esta acción sobre ti mismo' );
    } else {
        next();
    }
}

/**
 * Middleware para express que comprueba si una fecha es válida.
 * 
 * @param {string} dateValue Fecha.
 * @param {*} req Peticion del cliente.
 */
const validateDateExpress = ( dateValue , { req } ) => {
    if( isNaN( new Date( dateValue ) ) === true ){
        throw new Error( 'La fecha debe ser válida y estar en el pasado' );
    }

    return true;
}

// Marcar para exportar
module.exports = { validateSensitiveActionUser, validateNotSelf, validateDateExpress }