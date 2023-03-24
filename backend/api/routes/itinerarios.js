/**
 * ROUTE: Itinerarios
 * URL base: /api/itinerarios
 */

// === IMPORTAR ===

// Librerias de terceros
const { Router } = require( 'express' ); // Router de Express
const { query , param , body } = require( 'express-validator' ); // body de Express Validator

// Propio
const { validateJWT } = require( '../middleware/jwt.js' ); // Validador de JSON Web Token
const { validateFields } = require( '../middleware/validateFields.js' ); // Validador de JSON Web Token
const { toUniversalPath } = require( '../helpers/metodos.js' );
const { validateSensitiveActionUser, validateNotSelf, validateDateExpress } = require( '../middleware/validators.js' );
//const {  } = require( '../middleware/files' );
const {  } = require( '../controllers/publicaciones.js' ); // Controller Itinerarios

// ----------------


// === INICIALIZAR ===

// Router
const router = Router();

// -------------------


// === LLAMADAS ===

router.route( '/' )
    .get(
        
    )
    


// ----------------

// Marcar todo para exportar
module.exports = router;