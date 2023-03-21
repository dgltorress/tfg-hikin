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

/**
 * Elimina parametros de URL no admitidos de un objeto de parametros.
 * 
 * @param {*} queries Objeto de parametros de URL de la peticion (req.query en Express)
 * @param {string array} accepted Nombre de los parametros de URL aceptados ([ 'before' , 'after' , etc ]). Vacio devuelve el mismo objeto.
 * 
 * @returns {*} Objeto de parametros filtrados.
 */
 const filterQueries = ( queries , accepted = [] ) => {
    if( accepted.length === 0 ) return query;
    if( typeof queries === 'object' ){
        let filteredQueries = {};

        for( let i = 0 ; i < accepted.length ; i++ ){
            let query = queries[ accepted[ i ] ];
            if( query ) filteredQueries[ accepted[ i ] ] = query;
        }

        return filteredQueries;
    }
    else{
        console.warn( `Parametros de llamada al metodo filterQueries() erroneos (queries: ${queries}) NO es un objeto` );
    }
    return null;
}

// Marcar para exportar
module.exports = { validateAdmin }