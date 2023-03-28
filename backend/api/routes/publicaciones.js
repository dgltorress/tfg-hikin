/**
 * ROUTE: Publicaciones
 * URL base: /api/publicaciones
 */

// === IMPORTAR ===

// Librerias de terceros
const { Router } = require( 'express' ); // Router de Express
const { query , param , body } = require( 'express-validator' ); // body de Express Validator

// Propio
const { validateJWT } = require( '../middleware/jwt.js' ); // Validador de JSON Web Token
const { validateFields } = require( '../middleware/validateFields.js' ); // Validador de JSON Web Token
const { validateDateExpress } = require( '../middleware/validators.js' );
const { uploadPostImage } = require( '../middleware/files' );
const { getPublicaciones, createPublicacion,
    getPublicacion, deletePublicacion,
    darKudos, quitarKudos,
    getComentarios, createComentario, deleteComentario,
    cambiarImagen, cambiarImagenResponse } = require( '../controllers/publicaciones.js' ); // Controller Publicaciones

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
        query( 'autor' , 'Número natural mayor que 0' ).optional().isInt( { min: 1 } ).toInt(),
        query( 'itinerario' , 'Número natural mayor que 0' ).optional().isInt( { min: 1 } ).toInt(),
        query( 'club' , 'Número natural mayor que 0' ).optional().isInt( { min: 1 } ).toInt(),
        query( 'desde' , 'Fecha válida' ).optional().custom( validateDateExpress ).toDate(),
        query( 'hasta' , 'Fecha válida' ).optional().custom( validateDateExpress ).toDate(),
        query( 'p' , 'Número natural' ).optional().isInt( { min: 0 } ).toInt(),
        validateFields,
        getPublicaciones
    )
    .post(
        validateJWT,
        body( 'titulo' , 'Entre 3 y 50 caracteres' ).exists().isString().isLength( { min: 3 , max: 50 } ),
        body( 'descripcion' , 'Entre 3 y 250 caracteres' ).exists().isString().isLength( { min: 3 , max: 250 } ),
        body( 'itinerario' , 'Número natural mayor que 0' ).optional().isInt( { min: 1 } ).toInt(),
        body( 'club' , 'Número natural mayor que 0' ).optional().isInt( { min: 1 } ).toInt(),
        validateFields,
        createPublicacion
    );

router.route( '/:id' )
    .get(
        validateJWT,
        param( 'id' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        getPublicacion
    )
    .delete(
        validateJWT,
        param( 'id' , 'Número natural mayor que 1' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        deletePublicacion
    );

router.route( '/:id/imagen' )
    .post(
        validateJWT,
        param( 'id' , 'Número natural mayor que 1' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        cambiarImagen,
        uploadPostImage,
        cambiarImagenResponse
    );

router.route( '/:id/kudos' )
    .post(
        validateJWT,
        param( 'id' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        darKudos
    )
    .delete(
        validateJWT,
        param( 'id' , 'Número natural mayor que 1' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        quitarKudos
    );

router.route( '/:id/comentarios' )
    .get(
        validateJWT,
        param( 'id' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        getComentarios
    )
    .post(
        validateJWT,
        param( 'id' , 'Número natural mayor que 1' ).exists().isInt( { min: 1 } ).toInt(),
        body( 'texto' , 'Entre 3 y 150 caracteres' ).exists().isString().isLength( { min: 3 , max: 150 } ),
        validateFields,
        createComentario
    );

router.route( '/:pubId/comentarios/:comId' )
    .delete(
        validateJWT,
        param( 'pubId' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        param( 'comId' , 'Número natural mayor que 0' ).exists().isInt( { min: 1 } ).toInt(),
        validateFields,
        deleteComentario
    );
    


// ----------------

// Marcar todo para exportar
module.exports = router;