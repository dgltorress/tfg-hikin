/**
 * ROUTE: Usuarios
 * URL base: /api/usuarios
 */

// === IMPORTAR ===

// Librerias de terceros
const { Router } = require( 'express' ); // Router de Express
const { query , body } = require( 'express-validator' ); // body de Express Validator

// Propio
const { validateJWT } = require( '../middleware/jwt.js' ); // Validador de JSON Web Token
const { validateFields } = require( '../middleware/validateFields.js' ); // Validador de JSON Web Token
const { getUsuarios, createUsuario } = require( '../controllers/usuarios.js' ); // Controller Usuarios
//const {  } = require('../middleware/files');

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
        query( 'p' , 'Número natural' ).optional().isInt( { min: 0 } ),
        validateFields,
        getUsuarios
    )
    .post(
        body( 'email' , 'Campo obligatorio (entre 3 y 60 caracteres)' ).exists().isEmail().isLength( { min: 3 , max: 60 } ),
        body( 'contrasena' , 'Campo obligatorio' ).exists().isString(),
        body( 'usuario' , 'Entre 3 y 15 caracteres' ).optional().isString().isLength( { min: 3 , max: 15 } ),
        body( 'nombre' , 'Entre 3 y 40 caracteres' ).optional().isString().isLength( { min: 3 , max: 40 } ),
        body( 'sexo' , 'Entero: 0, 1, 2 o 9' ).optional().isInt().custom( ( sexValue , { req } ) => {
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