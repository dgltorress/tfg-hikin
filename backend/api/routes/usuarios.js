/**
 * ROUTE: Usuarios
 * URL base: /api/usuarios
 */

// === IMPORTAR ===

// Librerias de terceros
const { Router } = require( 'express' ); // Router de Express
const { query , param , body } = require( 'express-validator' ); // body de Express Validator

// Propio
const { validateJWT } = require( '../middleware/jwt.js' ); // Validador de JSON Web Token
const { validateFields } = require( '../middleware/validateFields.js' ); // Validador de JSON Web Token
const { toUniversalPath } = require( '../helpers/metodos.js' );
const { validateSensitiveAccess } = require( '../middleware/validators.js' );
//const {  } = require('../middleware/files');
const { getUsuarios, getUsuario, createUsuario, updateUsuario } = require( '../controllers/usuarios.js' ); // Controller Usuarios

// ----------------


// === INICIALIZAR ===

// Router
const router = Router();

// -------------------


// === LLAMADAS ===

router.route( '/' )
    .get(
        validateJWT,
        query( 'usuario' , 'Entre 1 y 15 caracteres' ).optional().isString().isLength( { min: 1 , max: 15 } ),
        query( 'nombre' , 'Entre 1 y 40 caracteres' ).optional().isString().isLength( { min: 1 , max: 40 } ),
        query( 'p' , 'Número natural' ).optional().isInt( { min: 0 } ).toInt(),
        validateFields,
        getUsuarios
    )
    .post(
        body( 'email' , 'Campo obligatorio (email válido, máx. 60 caracteres)' ).exists().isEmail().isLength( { max: 60 } ),
        body( 'contrasena' , 'Campo obligatorio (más de 7 caracteres)' ).exists().isString().isLength( { min: 8 } ),
        body( 'usuario' , 'Entre 3 y 15 caracteres' ).optional().isString().isLength( { min: 3 , max: 15 } ),
        body( 'nombre' , 'Entre 3 y 40 caracteres' ).optional().isString().isLength( { min: 3 , max: 40 } ),
        body( 'sexo' , 'Entero: 0, 1, 2 o 9' ).optional().isInt().toInt().custom( ( sexValue , { req } ) => {
            if( ( sexValue !== 0 ) &&
                ( sexValue !== 1 ) &&
                ( sexValue !== 2 ) &&
                ( sexValue !== 9 ) ){
              throw new Error( 'El sexo sigue el estándar ISO/IEC 5218 (0: Desconocido | 1: Varón | 2: Mujer | 9: No aplicable)' );
            }

            return true;
        } ),
        validateFields,
        createUsuario
    );

router.route( '/:id' )
    .get(
        validateJWT,
        param( 'id' , 'Número natural mayor que 1' ).isInt( { min: 1 } ).toInt(),
        validateFields,
        getUsuario
    )
    .patch(
        validateJWT,
        validateSensitiveAccess,
        body( 'email' , 'Email válido, máx. 60 caracteres' ).optional().isEmail().isLength( { max: 60 } ),
        body( 'contrasena' , 'Más de 7 caracteres' ).optional().isString().isLength( { min: 8 } ),
        body( 'usuario' , 'Entre 3 y 15 caracteres' ).optional().isString().isLength( { min: 3 , max: 15 } ),
        body( 'nombre' , 'Entre 3 y 40 caracteres' ).optional().isString().isLength( { min: 3 , max: 40 } ),
        body( 'bio' , 'Entre 3 y 120 caracteres' ).optional().isString().isLength( { min: 3 , max: 120 } ),
        body( 'sexo' , 'Entero: 0, 1, 2 o 9' ).optional().isInt().toInt().custom( ( sexValue , { req } ) => {
            if( ( sexValue !== 0 ) &&
                ( sexValue !== 1 ) &&
                ( sexValue !== 2 ) &&
                ( sexValue !== 9 ) ){
              throw new Error( 'El sexo sigue el estándar ISO/IEC 5218 (0: Desconocido | 1: Varón | 2: Mujer | 9: No aplicable)' );
            }

            return true;
        } ),
        body( 'fecha_nac' , 'Fecha válida' ).optional().isDate().toDate().custom( ( dateValue , { req } ) => {
            if( dateValue > new Date() ){
              throw new Error( 'La fecha debe estar en el pasado' );
            }

            return true;
        } ),
        validateFields,
        updateUsuario
    )


    //usuario, email,
    //contrasena,
    //nombre, bio,
    //sexo, fecha_nac, privado, premium,
    //fecha_reg,
    //ultimo_acceso,
    //ipv4, imagen

// ----------------

// Marcar todo para exportar
module.exports = router;