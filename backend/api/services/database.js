/**
 * SERVICIO: Base de datos
 */

// === IMPORTAR ===

// Propio
const { COLOR } = require( '../helpers/constantes.js' ); // Constantes complejas

// ----------------

const mariadb = require( 'mariadb' );
let connection;

/*mariadb.createConnection( {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 1
} ).then( ( conn ) => {
    conn.connect( ( err ) => {
        if( err ){
            console.error( `${COLOR.texto.rojo}ERROR al conectar con la base de datos${COLOR.reset}` );
            console.error( err );
        } else {
            connection = conn;
            console.log( `${COLOR.texto.verde}== BD online ==${COLOR.reset}` );
        }
    } );
} );*/

module.exports = {};