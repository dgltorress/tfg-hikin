/**
 * ROUTE: Auth
 * URL base: /api/auth
 */

// Librerias de terceros
const { Router } = require( 'express' ); // Router de Express
const { body } = require( 'express-validator' ); // body de Express Validator

// Propio
const { validateJWT } = require( '../middleware/jwt.js' ); // Validador de JSON Web Token
const { validateFields } = require( '../middleware/validateFields.js' ); // Validador de JSON Web Token
const { login } = require( '../controllers/auth.js' );  // Controller Auth
//const {  } = require('../middleware/files');

// === INICIALIZAR ===

// Router
const router = Router();

// -------------------


// === LLAMADAS ===

router.route( '/' )
    .post(
        body( 'email' , 'Campo obligatorio' ).exists(),
        body( 'contrasena' , 'Campo obligatorio' ).exists(),
        validateFields,
        login
    );

// ----------------

module.exports = router;