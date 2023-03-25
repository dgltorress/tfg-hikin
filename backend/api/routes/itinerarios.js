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
const { getItinerarios, getItinerario,
    getResenas, createResena, deleteResena } = require( '../controllers/itinerarios.js' ); // Controller Itinerarios

// ----------------


// === INICIALIZAR ===

// Router
const router = Router();

// -------------------


// === LLAMADAS ===

router.route( '/' )
    .get(
        validateJWT,
        query( 'cod' , 'Entre 1 y 10 caracteres' ).optional().isString().isLength( { min: 1 , max: 10 } ),
        query( 'texto' , 'Entre 1 y 30 caracteres' ).optional().isString().isLength( { min: 1 , max: 30 } ),
        query( 'codauto' , 'Número natural mayor que 0' ).optional().isInt( { min: 1 } ).toInt(),
        query( 'cpro' , 'Número natural mayor que 0' ).optional().isInt( { min: 1 } ).toInt(),
        query( 'dificultad' , 'Número natural entre 1 y 3' ).optional().isInt( { min: 1, max: 3 } ).toInt(),
        query( 'dist_min' , 'Número natural' ).optional().isInt( { min: 0 } ).toInt(),
        query( 'dist_max' , 'Número natural' ).optional().isInt( { min: 0 } ).toInt(),
        query( 'desn_min' , 'Número natural' ).optional().isInt( { min: 0 } ).toInt(),
        query( 'desn_max' , 'Número natural' ).optional().isInt( { min: 0 } ).toInt(),
        query( 'tiempo_min' , 'Número natural' ).optional().isInt( { min: 0 } ).toInt(),
        query( 'tiempo_max' , 'Número natural' ).optional().isInt( { min: 0 } ).toInt(),
        query( 'circular' , 'Booleano' ).optional().isBoolean().toBoolean(),
        query( 'p' , 'Número natural' ).optional().isInt( { min: 0 } ).toInt(),
        validateFields,
        getItinerarios
    );

router.route( '/:id' )
    .get(
        validateJWT,
        param( 'id' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        getItinerario
    );

router.route( '/:id/resenas' )
    .get(
        validateJWT,
        param( 'id' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        getResenas
    )
    .post(
        validateJWT,
        param( 'id' , 'Número natural mayor que 1' ).exists().isInt( { min: 1 } ).toInt(),
        body( 'valoracion' , 'Natural entre 1 y 5' ).exists().isInt( { min: 1, max: 5 } ).toInt(),
        body( 'observaciones' , 'Entre 3 y 750 caracteres' ).optional().isString().isLength( { min: 3 , max: 750 } ),
        validateFields,
        createResena
    );

router.route( '/:itId/resenas/:userId' )
    .delete(
        validateJWT,
        param( 'itId' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        param( 'userId' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        deleteResena
    );
    


// ----------------

// Marcar todo para exportar
module.exports = router;