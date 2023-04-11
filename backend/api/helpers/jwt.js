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

let JWTExpire; // Tiempo para expirar. Por defecto 24h.
let JWTExpireMilliseconds;
const defaultExpireString = '24h';

try{
    JWTExpireMilliseconds = ms( process.env.JWT_EXPIRE );
    JWTExpire = process.env.JWT_EXPIRE;
} catch ( err ) {
    JWTExpireMilliseconds = ms( defaultExpireString );
    JWTExpire = defaultExpireString;
}

// Notifica de si se ha activado algún registro permanente.
if( ( JWTSecret !== '' ) && ( JWTExpire !== '' ) ){
    console.log( `
${COLOR.texto.magenta}----------------------------------

Opciones de JSON Web Token:
Secreto detectado.
Tiempo para expirar: ${COLOR.texto.cian}${ms( JWTExpire )} ms${COLOR.texto.magenta} (${COLOR.texto.cian}${JWTExpire}${COLOR.texto.magenta})

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
                isAdmin: Boolean( isAdmin )
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
module.exports = { generateJWT , JWTSecret , JWTExpire , JWTExpireMilliseconds };