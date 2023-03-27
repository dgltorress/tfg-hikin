/**
 * SERVICIO: Base de datos
 * 
 * Docs: https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/callback-api.md
 */

// === IMPORTAR ===

// Propio
const { COLOR } = require( '../helpers/constantes.js' ); // Constantes complejas

// ----------------

// Conector MariaDB
const mariadb = require( 'mariadb/callback' );

// Variables de conexión
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = process.env.DB_PORT || '3306';
const dbUser = process.env.DB_USER;
const dbPwd = process.env.DB_PWD;
const dbName = process.env.DB_NAME;

// Crear conexiones
const adminConnection = mariadb.createConnection( {
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPwd,
    database: dbName,

    insertIdAsNumber: true, // El sistema no es capaz de trabajar con BigInt
    bigIntAsNumber: true
} );
adminConnection.connect( ( err ) => {
    console.log( `
Iniciando conexión de administrador con la base de datos en: ${COLOR.texto.cian}mariadb://${dbHost}:${dbPort}/${dbName}${COLOR.reset}
con usuario "${COLOR.texto.cian}${dbUser}${COLOR.reset}"...
` );
    if( err ){
        console.error( `${COLOR.texto.rojo}ERROR al conectar con la base de datos${COLOR.reset}` );
        console.error( err );
    } else {
        console.log( `${COLOR.texto.verde}== BD online (${adminConnection.serverVersion()}) ==${COLOR.reset}` );
    }
    adminConnection = connection;
} );


module.exports = { adminConnection };