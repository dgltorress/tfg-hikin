/**
 * CONTROLLER: USER
 */

// === IMPORTAR ===

// Librerias de terceros
const bcrypt = require('bcryptjs'); // BcryptJS
const { toLong } = require( 'ip' ); // Pasar IPs a version entera

// Propio
const { COLOR , HTTP , textRegExEsp } = require( '../helpers/constantes.js' ); // Constantes
const { getIp , filterQueries , toUniversalPath, universalPathSeparator } = require( '../helpers/metodos.js' ); // Metodos generales
const { logRequest } = require( '../helpers/log.js' ); // Registro
const { generateJWT , JWTExpire } = require( '../helpers/jwt' ); // Generador de JSON Web Token
const { RUTAMASKFULL } = require( '../helpers/rutas.js' ); // Rutas

// ----------------



// * ================== GET ======================



// -----------------------------------------------


// * ================== POST =====================



// -----------------------------------------------



// * ================== PUT ======================



// -----------------------------------------------


// * ================= PATCH =====================



// -----------------------------------------------


// * ================= DELETE ====================



// -----------------------------------------------






// Marcar los metodos para exportar
module.exports = {  };