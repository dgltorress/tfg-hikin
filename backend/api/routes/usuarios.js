/**
 * ROUTE: Usuarios
 * URL base: /api/usuarios
 */

// === IMPORTAR ===

// Librerias de terceros
const { Router } = require('express'); // Router de Express
//const { check } = require('express-validator'); // check de Express Validator

// Propio
//const { validateJWT } = require('../middleware/jwt'); // Validador de JSON Web Token
const { getUsuarios } = require('../controllers/usuarios.js'); // Controller User
//const {  } = require('../middleware/files');

// ----------------


// === INICIALIZAR ===

// Router
const router = Router();

// -------------------


// === LLAMADAS ===

router.route( '/' )
    .get(
        getUsuarios
    );

// ----------------

// Marcar todo para exportar
module.exports = router;