/**
 * VALIDADOR DE CAMPOS DE FORMULARIOS
 */

// === IMPORTAR ===

// Librerias de terceros
const { validationResult } = require( 'express-validator' ); // ValidationResult de Express Validator

// Propio
const { HTTP } = require( '../helpers/constantes.js' ); // Códigos de estado HTTP
const { logRequest } = require( '../helpers/log.js' ); // Registro

// ----------------



/**
 * Valida los campos de un formulario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 * @param {*} next Siguiente método a ejecutar.
 */
const validateFields = ( req , res , next ) => {
    const valResult = validationResult( req );
    if( valResult.isEmpty() !== true ){
        res.status( HTTP.error_client.bad_request ).json( {
            errors: valResult.mapped()
        } );
        logRequest( req , 'validateFields' , HTTP.error_client.bad_request );
        return;
    }

    next();
}

// Marcar para exportar.
module.exports = { validateFields }