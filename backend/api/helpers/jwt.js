/**
 * HELPER: JSON Web Token
 */

// Importa JSON Web Token.
const jwt       = require( 'jsonwebtoken' );
const ms        = require( 'ms' );
const { COLOR } = require( './constantes.js' );

// Parsea las variables de entorno.
const JWTSecret = ( process.env.JWT_SECRET &&
                    process.env.JWT_SECRET.length > 0 ) ? process.env.JWT_SECRET : '' ; // Secreto JWT.

const JWTExpire = ( process.env.JWT_EXPIRE &&
                    process.env.JWT_EXPIRE.length > 0 &&
                    ms( process.env.JWT_EXPIRE ) ) ? ms( process.env.JWT_EXPIRE ) : ms( '24h' ) ; // Tiempo para expirar. Por defecto 24h.

// Notifica de si se ha activado algún registro permanente.
if( ( JWTSecret !== '' ) && ( JWTExpire !== '' ) ){
    console.log( `
${COLOR.texto.magenta}----------------------------------

Opciones de JSON Web Token:
Secreto detectado.
Tiempo para expirar: ${COLOR.texto.cian}${JWTExpire} ms${COLOR.texto.magenta} (${COLOR.texto.cian}${ms( JWTExpire )}${COLOR.texto.magenta})

${COLOR.texto.magenta}----------------------------------${COLOR.reset}
` );
}
else{
    console.error( `${COLOR.texto.rojo}ERROR${COLOR.reset}: no se ha podido inicializar JWT (/helpers/jwt.js)
Comprueba las variables de entorno` );
    process.exit( 1 );
}

// Función que genera y devuelve un JWT.
const generateJWT = ( id , isAdmin ) => {
    return new Promise( ( resolve , reject ) => {
        const payload = {
            user: {
                id ,
                isAdmin
            }
        };
        jwt.sign( payload , JWTSecret , {
            expiresIn: JWTExpire
        } , ( err , token ) => {
            if( err ){
                console.error( err );
                reject( `${COLOR.texto.rojo}ERROR: No se pudo generar el JWT${COLOR.reset}` );
            } else {
                resolve( token );
            }
        } );
    } );
}
module.exports = { generateJWT , JWTSecret , JWTExpire };