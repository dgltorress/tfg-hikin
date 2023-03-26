/**
 * ROUTE: Salidas
 * URL base: /api/salidas
 */

// === IMPORTAR ===

// Librerias de terceros
const { Router } = require( 'express' ); // Router de Express
const { query , param , body } = require( 'express-validator' ); // body de Express Validator

// Propio
const { validateJWT } = require( '../middleware/jwt.js' ); // Validador de JSON Web Token
const { validateFields } = require( '../middleware/validateFields.js' ); // Validador de JSON Web Token
const { toUniversalPath } = require( '../helpers/metodos.js' );
const { validateDateExpress } = require( '../middleware/validators.js' );
//const {  } = require( '../middleware/files' );
const { getSalidas, getSalida,
    createSalida, updateSalida, deleteSalida,
    inscribirseSalida, desinscribirseSalida,
    invitarSalida, desinvitarSalida } = require( '../controllers/salidas.js' ); // Controller Salidas

// ----------------


// === INICIALIZAR ===

// Router
const router = Router();

// -------------------


// === LLAMADAS ===

router.route( '/' )
    .get(
        validateJWT,
        query( 'texto' , 'Entre 1 y 30 caracteres' ).optional().isString().isLength( { min: 1 , max: 30 } ),
        query( 'organizador' , 'Número natural mayor que 0' ).optional().isInt( { min: 1 } ).toInt(),
        query( 'itinerario' , 'Número natural mayor que 0' ).optional().isInt( { min: 1 } ).toInt(),
        query( 'club' , 'Número natural mayor que 0' ).optional().isInt( { min: 1 } ).toInt(),
        query( 'desde' , 'Fecha válida' ).optional().custom( validateDateExpress ).toDate(),
        query( 'hasta' , 'Fecha válida' ).optional().custom( validateDateExpress ).toDate(),
        query( 'codauto' , 'Número natural mayor que 0' ).optional().isInt( { min: 1 } ).toInt(),
        query( 'cpro' , 'Número natural mayor que 0' ).optional().isInt( { min: 1 } ).toInt(),
        query( 'p' , 'Número natural' ).optional().isInt( { min: 0 } ).toInt(),
        validateFields,
        getSalidas
    )
    .post(
        validateJWT,
        body( 'nombre' , 'Obligatorio (entre 3 y 80 caracteres)' ).exists().isString().isLength( { min: 3 , max: 80 } ),
        body( 'descripcion' , 'Obligatorio (entre 3 y 600 caracteres)' ).exists().isString().isLength( { min: 3 , max: 600 } ),
        body( 'itinerario' , 'Obligatorio (número natural mayor que 0)' ).exists().isInt( { min: 1 } ).toInt(),
        body( 'club' , 'Obligatorio (número natural mayor que 0)' ).optional().isInt( { min: 1 } ).toInt(),
        body( 'fecha_inicio' , 'Fecha válida' ).exists().custom( validateDateExpress ).toDate(),
        body( 'fecha_fin' , 'Fecha válida' ).exists().custom( validateDateExpress ).toDate(),
        body( 'privada' , 'Booleano' ).optional().isBoolean().toBoolean(),
        validateFields,
        createSalida
    );

router.route( '/:id' )
    .get(
        validateJWT,
        param( 'id' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        getSalida
    )
    .patch(
        validateJWT,
        body( 'nombre' , 'Obligatorio (entre 3 y 80 caracteres)' ).optional().isString().isLength( { min: 3 , max: 80 } ),
        body( 'descripcion' , 'Obligatorio (entre 3 y 600 caracteres)' ).optional().isString().isLength( { min: 3 , max: 600 } ),
        body( 'club' , 'Obligatorio (número natural mayor que 0)' ).optional().isInt( { min: 1 } ).toInt(),
        body( 'itinerario' , 'Obligatorio (número natural mayor que 0)' ).optional().isInt( { min: 1 } ).toInt(),
        body( 'fecha_inicio' , 'Fecha válida' ).optional().custom( validateDateExpress ).toDate(),
        body( 'fecha_fin' , 'Fecha válida' ).optional().custom( validateDateExpress ).toDate(),
        body( 'privada' , 'Booleano' ).optional().isBoolean().toBoolean(),
        body( 'cancelada' , 'Booleano' ).optional().isBoolean().toBoolean(),
        validateFields,
        updateSalida
    )
    .delete(
        validateJWT,
        param( 'id' , 'Número natural mayor que 1' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        deleteSalida
    );

router.route( '/:id/inscripcion' )
    .post(
        validateJWT,
        param( 'id' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        inscribirseSalida
    )
    .delete(
        validateJWT,
        param( 'id' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        desinscribirseSalida
    );

router.route( '/:id/valoraciones' )
    .post(

    );

router.route( '/:clubId/invitacion/:userId' )
    .post(
        validateJWT,
        param( 'clubId' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        param( 'userId' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        invitarSalida
    )
    .delete(
        validateJWT,
        param( 'clubId' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        param( 'userId' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        desinvitarSalida
    );


// ----------------

// Marcar todo para exportar
module.exports = router;