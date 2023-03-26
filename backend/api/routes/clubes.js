/**
 * ROUTE: Clubes
 * URL base: /api/clubes
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
const { getClubes, getClub,
    createClub, updateClub, deleteClub,
    inscribirseClub, desinscribirseClub,
    invitarClub, desinvitarClub, } = require( '../controllers/clubes.js' ); // Controller Clubes

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
        query( 'propietario' , 'Número natural mayor que 0' ).optional().isInt( { min: 1 } ).toInt(),
        query( 'codauto' , 'Número natural mayor que 0' ).optional().isInt( { min: 1 } ).toInt(),
        query( 'cpro' , 'Número natural mayor que 0' ).optional().isInt( { min: 1 } ).toInt(),
        query( 'privado' , 'Booleano' ).optional().isBoolean().toBoolean(),
        query( 'p' , 'Número natural' ).optional().isInt( { min: 0 } ).toInt(),
        validateFields,
        getClubes
    )
    .post(
        validateJWT,
        body( 'nombre' , 'Obligatorio (entre 3 y 60 caracteres)' ).exists().isString().isLength( { min: 3 , max: 60 } ),
        body( 'codauto' , 'Obligatorio (número natural mayor que 0)' ).exists().isInt( { min: 1 } ).toInt(),
        body( 'cpro' , 'Obligatorio (número natural mayor que 0)' ).optional().isInt( { min: 1 } ).toInt(),
        body( 'descripcion' , 'Entre 3 y 200 caracteres' ).optional().isString().isLength( { min: 3 , max: 200 } ),
        body( 'privado' , 'Booleano' ).optional().isBoolean().toBoolean(),
        validateFields,
        createClub
    );

router.route( '/:id' )
    .get(
        validateJWT,
        param( 'id' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        getClub
    )
    .patch(
        validateJWT,
        param( 'id' , 'Número natural mayor que 1' ).exists().isInt( { min: 1 } ).toInt(),
        body( 'nombre' , 'Obligatorio (entre 3 y 60 caracteres)' ).optional().isString().isLength( { min: 3 , max: 60 } ),
        body( 'codauto' , 'Número natural mayor que 0' ).optional().isInt( { min: 1 } ).toInt(),
        body( 'cpro' , 'Número natural mayor que 0' ).optional().isInt( { min: 1 } ).toInt(),
        body( 'descripcion' , 'Entre 3 y 200 caracteres' ).optional().isString().isLength( { min: 3 , max: 200 } ),
        body( 'privado' , 'Booleano' ).optional().isBoolean().toBoolean(),
        validateFields,
        updateClub
    )
    .delete(
        validateJWT,
        param( 'id' , 'Número natural mayor que 1' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        deleteClub
    );

router.route( '/:id/imagen' )
    .post(
        
    )
    .delete(
        
    );

router.route( '/:id/inscripcion' )
    .post(
        validateJWT,
        param( 'id' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        inscribirseClub
    )
    .delete(
        validateJWT,
        param( 'id' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        desinscribirseClub
    );

router.route( '/:clubId/invitacion/:userId' )
    .post(
        validateJWT,
        param( 'clubId' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        param( 'userId' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        invitarClub
    )
    .delete(
        validateJWT,
        param( 'clubId' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        param( 'userId' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        desinvitarClub
    );



// ----------------

// Marcar todo para exportar
module.exports = router;