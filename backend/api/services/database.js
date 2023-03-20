/**
 * SERVICIO: Base de datos
 * 
 * Docs: https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/callback-api.md
 */

// === IMPORTAR ===

// Propio
const { COLOR } = require( '../helpers/constantes.js' ); // Constantes complejas

// ----------------

const mariadb = require( 'mariadb/callback' );

// Conexiones
const adminConnection = mariadb.createConnection( {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
} );
adminConnection.connect( ( err ) => {
    if( err ){
        console.error( `${COLOR.texto.rojo}ERROR al conectar con la base de datos${COLOR.reset}` );
        console.error( err );
    } else {
        console.log( `${COLOR.texto.verde}== BD online ==${COLOR.reset}` );
    }
    adminConnection = connection;
} );


module.exports = { adminConnection };