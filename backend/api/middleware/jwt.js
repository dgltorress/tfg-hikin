/**
 * MIDDLEWARE: JSON Web Token
 */

// === IMPORTAR ===

// Librerias de terceros
const jwt = require( 'jsonwebtoken' ); // JSON Web Token

// Propio
const { HTTP } = require( '../constantes.js' ); // Codigos de estado HTTP
const { logRequest } = require( '../controllers/log.js' ); // Registro

// ----------------


/**
 * Valida un JSON Web Token. Impide la ejecucion de otras funciones si no se verifica.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta del servidor.
 * @param {*} next Siguiente metodo a ejecutar.
 */
const validateJWT = (req, res, next) => {
    // Obtiene la cabecera de autenticacion.
    let authHeader = req.headers.authorization;

    // Si no existe, se notifica y termina.
    if ( !authHeader ) {
        res.status( HTTP.error_client.unauthorized ).json({
            msg: 'Falta cabecera de autenticacion'
        });
        logRequest( req , 'validateJWT' , HTTP.error_client.unauthorized , 'Falta cabecera de autenticacion' );
    }
    // Si existe,
    else{
        // Extrae el JWT de la cabecera.
        let token = extractBearerToken( authHeader );

        // Si el token consigue extraerse,
        if( token ){
            try {
                // Se extrae el UID del usuario que ha realizado la peticion a partir del JWT.
                const { uid, role } = jwt.verify( token, process.env.JWTSECRET );

                // Se guarda el UID en el objeto peticion, "req". "req" es accesible desde cualquier parte.
                req.uid  = uid;
                req.role = role;

                // Pasa al siguiente metodo.
                next();
            } catch (err) {
                res.status( HTTP.error_client.unauthorized ).json({
                    msg: 'Token no valido'
                });
                logRequest( req , 'validateJWT' , HTTP.error_client.unauthorized , 'Token no valido' );
            }
        }
        // Si el token no consigue extraerse, se notifica y termina.
        else{
            res.status( HTTP.error_client.unauthorized ).json({
                msg: 'Token no encontrado (Estilo cabecera > Authorization: Bearer [JWT])'
            });
            logRequest( req , 'validateJWT' , HTTP.error_client.unauthorized , 'Token no encontrado' );
        }
    }

    return;
}

/**
 * Intenta validar un JSON Web Token. Si no existe, pasa a la siguiente funcion.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta del servidor.
 * @param {*} next Siguiente metodo a ejecutar.
 */
 const validateJWTIfExists = (req, res, next) => {
    // Obtiene la cabecera de autenticacion.
    let authHeader = req.headers.authorization;

    // Si no existe, pasa a la siguiente funcion.
    if ( !authHeader ) {
        next();
    }
    // Si existe,
    else{
        // Extrae el JWT de la cabecera.
        let token = extractBearerToken( authHeader );

        // Si el token consigue extraerse,
        if( token ){
            try {
                // Se extrae el UID del usuario que ha realizado la peticion a partir del JWT.
                const { uid, role } = jwt.verify( token, process.env.JWTSECRET );

                // Se guarda el UID en el objeto peticion, "req". "req" es accesible desde cualquier parte.
                req.uid  = uid;
                req.role = role;

                // Pasa al siguiente metodo.
                next();
            } catch (err) {
                res.status( HTTP.error_client.unauthorized ).json({
                    msg: 'Token no valido'
                });
                logRequest( req , 'validateJWT' , HTTP.error_client.unauthorized , 'Token no valido' );
            }
        }
        // Si el token no consigue extraerse, pasa a la siguiente funcion.
        else{
            next();
        }
    }

    return;
}

/**
 * Extrae un JSON Web Token de una cabecera de autorizacion estandar.
 * Formato valido de la cabecera: "Authorization: 'Bearer [JWT]'"
 * 
 * @param {*} authHeader Cabecera de autenticacion.
 */
 const extractBearerToken = ( authHeader ) => {
    // Se comprueba que sea un string.
    if( typeof ( authHeader ) === 'string' ){
        // Se separa por el espacio.
        authHeader = authHeader.split( ' ' );

        // Se comprueba que hayan quedado dos elementos y el primero especifique
        // que el siguiente se refiere a un bearer token.
        if( ( authHeader.length === 2 ) &&
            ( authHeader[ 0 ].toUpperCase() === 'BEARER' ) ){
                return authHeader[ 1 ];
        }
    }
    return null;
}

// Marcar para exportar
module.exports = { extractBearerToken , validateJWT , validateJWTIfExists }