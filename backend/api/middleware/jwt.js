/**
 * MIDDLEWARE: JSON Web Token
 */

// === IMPORTAR ===

// Librerias de terceros
const jwt = require( 'jsonwebtoken' ); // JSON Web Token

// Propio
const { JWTSecret } = require( '../helpers/jwt' ); // Generador de JSON Web Token
const { HTTP } = require( '../helpers/constantes.js' ); // Codigos de estado HTTP
const { logRequest } = require( '../helpers/log.js' );  // Registro

// ----------------


/**
 * Valida un JSON Web Token que pertenece a un usuario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 * @param {*} next Siguiente método a ejecutar.
 * 
 * @param {boolean} checkAdmin (Opcional) Si comprobar que el JWT pertenece a un administrador. Por defecto `false`.
 * @param {boolean} expectHeader (Opcional) Si se espera una cabecera de autenticación. Por defecto `true`.
 */
const validateJWT = ( req , res , next , checkAdmin = false , expectHeader = true ) => {
    // Obtiene la cabecera de autenticacion.
    let authHeader = req.headers.authorization;

    // Si no existe, se notifica y termina.
    if ( !authHeader ) {
        if( expectHeader === true ){
            res.status( HTTP.error_client.unauthorized ).json( {
                msg: 'Falta cabecera de autenticación'
            } );
            logRequest( req , 'validateJWT' , HTTP.error_client.unauthorized , 'Falta cabecera de autenticación' );
        } else {
            next();
        }
    }
    // Si existe,
    else{
        // Extrae el JWT de la cabecera.
        let token = extractBearerToken( authHeader );

        // Si el token consigue extraerse,
        if( token ){
            try {
                // Se extrae el UID del usuario que ha realizado la peticion a partir del JWT.
                const verifiedToken = jwt.verify( token, JWTSecret );

                // Verifica los campos del token.
                if( verifiedToken.user &&
                    verifiedToken.user.id ){
                    // Si así se indica, se comprueba que el token pertenece a un administrador.
                    if( ( checkAdmin === true ) &&
                        ( verifiedToken.user.isAdmin !== 1 ) ){
                        res.status( HTTP.error_client.forbidden ).send();
                        logRequest( req , 'validateJWT' , HTTP.error_client.forbidden , 'Intento de acceso a endpoint de administrador' );
                        return;
                    }
                    // Guarda la información en el objeto petición, `req`. `req` es accesible desde cualquier parte.
                    req.user = verifiedToken.user;

                    // Pasa al siguiente método.
                    next();
                }
                else{
                    res.status( HTTP.error_server.internal ).json( {
                        msg: 'Error al autenticar'
                    } );
                    logRequest( req , 'validateJWT' , HTTP.error_client.unauthorized , 'Los campos del token descifrado no son los esperados' );
                }
            } catch( err ){
                res.status( HTTP.error_client.unauthorized ).json( {
                    msg: 'Token no válido'
                } );
                logRequest( req , 'validateJWT' , HTTP.error_client.unauthorized , 'Token no válido' );
            }
        }
        // Si el token no consigue extraerse, se notifica y termina.
        else{
            if( expectHeader === true ){
                res.status( HTTP.error_client.unauthorized ).json( {
                    msg: 'Token no encontrado (Estilo cabecera -> Authorization: Bearer [JWT])'
                } );
                logRequest( req , 'validateJWT' , HTTP.error_client.unauthorized , 'Token no encontrado' );
            } else {
                next();
            }
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
module.exports = { extractBearerToken , validateJWT }