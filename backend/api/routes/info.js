/**
 * ROUTE: Info
 * URL base: /api/info
 */

// === IMPORTAR ===

// Librerias de terceros
const { Router } = require( 'express' ); // Router de Express
const { query } = require( 'express-validator' ); // body de Express Validator

// Propio
const { validateJWT } = require( '../middleware/jwt.js' ); // Validador de JSON Web Token
const { validateFields } = require( '../middleware/validateFields.js' ); // Validador de JSON Web Token
const { getLocalidades, getAutonomias, getProvincias, getDistintivos } = require( '../controllers/info.js' ); // Controller Info

// ----------------


// === INICIALIZAR ===

// Router
const router = Router();

// -------------------


// === LLAMADAS ===

router.route( '/localidades' )
    .get(
        validateJWT,
        getLocalidades
    );

router.route( '/autonomias' )
    .get(
        validateJWT,
        getAutonomias
    );

router.route( '/provincias' )
    .get(
        validateJWT,
        query( 'codauto' , 'Número natural' ).optional().isInt( { min: 0 } ).toInt(),
        getProvincias
    );

router.route( '/distintivos' )
    .get(
        validateJWT,
        getDistintivos
    );


// ----------------

// Marcar todo para exportar
module.exports = router;