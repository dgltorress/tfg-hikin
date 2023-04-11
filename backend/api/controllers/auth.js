/**
 * CONTROLLER: Login
 */

// === IMPORTAR ===

// Librerias de terceros
const bcrypt = require( 'bcrypt' ); // BcryptJS

// Propio
const { adminConnection } = require( '../services/database.js' ); // Base de datos
const { COLOR , HTTP } = require( '../helpers/constantes.js' ); // Constantes
const { logRequest } = require( '../helpers/log.js' ); // Registro
const { generateJWT , JWTExpireMilliseconds } = require( '../helpers/jwt' ); // Generador de JSON Web Token
const { pullFields, resolveURL } = require( '../helpers/metodos.js' ); // Metodos generales
const { pfpURL } = require( '../middleware/files.js' );
const { RUTAMASKFULL } = require( '../helpers/rutas.js' ); // Rutas

// ----------------



/**
 * Resuelve un email y una contraseña y responde con un JSON Web Token.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta a enviar por el servidor.
 */
const login = async( req , res ) => {
    // Se extraen los campos "email" y "contrasena" del cuerpo de la peticion.
    const { email , contrasena } = req.body;

    // Se busca al usuario, su contraseña y si es administrador
    adminConnection.query(
`SELECT u.*, validar_usuario( u.id , TRUE ) AS isAdmin
FROM usuarios AS u
WHERE email = ?` , [
    email
] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'login' , HTTP.error_server.internal , `Error al obtener el usuario por email` );
                return;
            } else {
                // Comprueba que haya una coincidencia de email
                if( result.length !== 1 ){
                    res.status( HTTP.error_client.forbidden ).json( { msg: 'Email o contraseña incorrectos' } );
                    logRequest( req , 'login' , HTTP.error_client.forbidden , `Email "${email}" inexistente` );
                    return;
                }

                // Comprueba que la contraseña del usuario es válida
                const validPassword = bcrypt.compareSync( contrasena , result[ 0 ].contrasena );
                if( validPassword !== true ){
                    res.status( HTTP.error_client.forbidden ).json( { msg: 'Email o contraseña incorrectos' } );
                    logRequest( req , 'login' , HTTP.error_client.forbidden , `Contraseña incorrecta para email "${email}"` );
                    return;
                }

                // Actualiza la fecha de último acceso (asíncrono, no se le espera)
                adminConnection.query(
`UPDATE usuarios
SET ultimo_acceso = ?
WHERE id = ?` , [
    new Date(), result[ 0 ].id
] ,
                    ( err ) => {
                        if( err ){
                            console.warn( `${COLOR.texto.amarillo}ERROR al actualizar la fecha de último acceso del usuario con id "${result.id}"${COLOR.reset}` );
                            console.warn( err );
                        }
                    }
                );

                // Resuelve la URL de la imagen.
                if( result[ 0 ].imagen ){
                    result[ 0 ].imagen = resolveURL( result[ 0 ].imagen , `${RUTAMASKFULL}${pfpURL}` , -4 );
                }

                // Genera un token
                generateJWT( result[ 0 ].id , result[ 0 ].isAdmin ).then( ( token ) => {
                    // Elimina campos que no conviene enviar
                    pullFields( result[ 0 ] , [ 'contrasena' , 'ipv4' ] );

                    // Responde con el objeto usuario, el token y su expiración
                    res.status( HTTP.success.ok ).json( {
                        usuario: result[ 0 ],
                        token: {
                            jwt: token,
                            expires: JWTExpireMilliseconds
                        }
                    } );
                    logRequest( req , 'login' , HTTP.success.ok );
                } ).catch( ( err ) => {
                    console.error( err );
                    res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                    logRequest( req , 'login' , HTTP.error_server.internal , 'Error al generar el JWT' );
                } );
            }
        }
    );
}

module.exports = { login }
 