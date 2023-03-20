/**
 * HELPER: Registros
 */

// === IMPORTAR ===

// Librerias
const { resolve } = require( 'path' ); // Transformar rutas de archivo relativas
const fs          = require( 'fs' );   // FileSystem para operar con archivos
const { EOL }     = require( 'os' );   // Fin de linea para portabilidad entre sistemas operativos

// Propio
const { COLOR , PETICIONES } = require( './constantes.js' ); // Constantes complejas
const { getCaller }          = require( './metodos.js' );    // Métodos generales

// ----------------

// === INICIALIZAR

// Parsea las variables de entorno.
const logFilePath         = ( process.env.LOG_FILE_RELATIVE_PATH &&
                              process.env.LOG_FILE_RELATIVE_PATH.length > 0 ) ? resolve( process.env.LOG_FILE_RELATIVE_PATH ) : ''; // Ruta completa al archivo de registros.

const logCollectionName   = ( process.env.LOG_COLLECTION_NAME &&
                              process.env.LOG_COLLECTION_NAME.length > 0 ) ? process.env.LOG_COLLECTION_NAME : ''; // Nombre de la coleccion de registros en MongoDB.

const logConsoleIsEnabled = ( process.env.LOG_CONSOLE_ENABLED !== 'false' ) ? true : false ; // Si registrar acciones en la terminal. Por defecto true.

// Notifica de si se ha activado algun registro permanente.
if( logFilePath !== '' ){
    console.log( `
${COLOR.texto.magenta}----------------------------------

Registro en ${COLOR.texto.cian}archivos${COLOR.texto.magenta} ACTIVADO (desde ${COLOR.texto.cian}.env${COLOR.texto.magenta}).
Ruta completa del archivo: ${COLOR.texto.cian}${logFilePath}

${COLOR.texto.magenta}----------------------------------${COLOR.reset}
` );
}
if( logCollectionName !== '' ){
    console.log( `
${COLOR.texto.magenta}----------------------------------

Registro en ${COLOR.texto.cian}base de datos${COLOR.texto.magenta} ACTIVADO (desde ${COLOR.texto.cian}.env${COLOR.texto.magenta}).
Nombre de la coleccion: ${COLOR.texto.cian}${logCollectionName}

${COLOR.texto.magenta}----------------------------------${COLOR.reset}
` );
}
if( logConsoleIsEnabled === true ){
    console.log( `
${COLOR.texto.magenta}----------------------------------

Registro en ${COLOR.texto.cian}terminal${COLOR.texto.magenta} ACTIVADO.

----------------------------------${COLOR.reset}
` );
}

// --------------------------------


/**
 * Deja constancia de una peticion en la consola y, opcionalmente, en un archivo y en la base de datos.
 * Estas opciones se establecen en .env.
 * 
 * @param {*} req Peticion del cliente.
 * @param {string} functionName Nombre de la funcion invocada.
 * @param {number} status Codigo de estado HTTP de la respuesta.
 * @param {string} msg Mensaje adicional. Por defecto no hay.
 */
const logRequest = async( req , functionName , status , msg = '' ) => {
    // Se comprueba que las variables son correctas.
    if( req                             &&
        ( typeof functionName === 'string' ) &&
        ( typeof status       === 'number' ) &&
        ( typeof msg          === 'string' ) ){

        // === Se extrae informacion de la peticion y del servidor ===

        // Crea el objeto con sus propiedades obligatorias.
        const log = {
            date:         new Date().toISOString(),               // Hora UTC del servidor en el momento de generar la respuesta.
            ip:           req.ip || req.connection.remoteAddress, // IP resuelta por Express o la IP del ultimo cliente que envio la peticion.
            method:       req.method.toUpperCase(),               // Tipo de operacion especificada en la peticion en mayusculas.
            url:          req.originalUrl,                        // URL original de la peticion.
            functionName: functionName,                           // Nombre de la funcion invocada.
            status:       status                                  // Codigo de estado HTTP de la respuesta.
        };

        // Anade propiedades opcionales
        if( req.uid )    log[ 'uid' ]  = req.uid;  // UID del solicitante.
        if( req.role )   log[ 'role' ] = req.role; // Rol del solicitante.
        if( msg !== '' ) log[ 'msg' ]  = msg;      // Mensaje adicional.

        // -----------------------------------------------------------

        // Se convierte el objeto del registro a un string de una sola linea con colores de terminal.
        const line = logToString( log , true );

        // Se muestra la linea, si se ha activado.
        if( logConsoleIsEnabled === true ) console.log( line );

        // Realiza registros permanentes, si asi se ha indicado en .env.
        if( logFilePath       !== '' ) logRequestIntoFile( log );
        //if( logCollectionName !== '' ) logRequestIntoDB( log );
    }
    else console.warn( `Parametros de llamada a la funcion logRequest() erroneos (metodo: ${functionName} | status: ${status} | msg: ${msg})` );
}


/**
 * Guarda el registro de una peticion en un archivo como una sola linea.
 * 
 * @param {object} log Objeto de registro de actividad.
 * 
 * @returns {boolean} true si se escribe correctamente en el archivo. false si sucede algun error.
 */
const logRequestIntoFile = async( log ) => {
    // Se convierte el objeto del registro a un string de una sola linea sin colores de terminal.
    const line = logToString( log , false ) + EOL;

    // Se escribe la linea en el archivo de registros indicado.
    fs.appendFile( logFilePath , line , err => {
        if( err ){
            console.error( 'ERROR al guardar registro en el archivo' );
            console.error( err );
        }
    });
}


/**
 * Convierte un objeto de registro de actividad en un string de una linea.
 * 
 * @param {object} log Objeto de registro de actividad.
 * @param {boolean} color (Opcional) Si colorear con codigos de escape ANSI. Por defecto false.
 */
const logToString = ( log , color = false ) => {
    // Separa la fecha en partes.
    let date = log.date.split( 'T' );

    // Parsea los campos opcionales para que se puedan integrar facilmente al resto si existen.
    const uid  = ( log.uid )  ? ` | UID: ${log.uid}` : '';
    const role = ( log.role ) ? ` (${log.role})` : '';
    const msg  = ( log.msg )  ? ` - ${log.msg}` : '' ;

    // Se crea la cadena a mostrar. Empieza con la fecha y la hora.
    let line = `${date[0]} ${date[1].slice( 0 , 8 )} | ${log.ip}${uid}${role} | `;
    
    // Dependiendo de la operacion, se estiliza el mensaje de una forma u otra.
    let methodProperties = PETICIONES[ log.method ];
    // Metodos reconocidos.
    if( methodProperties ){
        if( color === true ){
            line += methodProperties.color;
        }
        line += methodProperties.prefijo;
    }
    // Metodos no reconocidos.
    else{
        if( color === true ){
            line += COLOR.magenta;
        }
        line += `${log.method} (UNSUPPORTED)`;
    }
    

    // Si el estado es de error, se colorea.
    let status;
    if( color === true ){
        if     ( log.status >= 500 ) status = COLOR.texto.rojo     + log.status + COLOR.reset; // Error de servidor.
        else if( log.status >= 400 ) status = COLOR.texto.amarillo + log.status + COLOR.reset; // Error de cliente.
        else                         status = log.status;
    }
    else status = log.status;

    // Se termina la linea.
    if( color === true ){
        line += COLOR.reset;
    }
    line += ` ${log.url} : ${log.functionName} (${status})${msg}`;

    return line;
}

// Marcar los metodos para exportar
module.exports = { logRequest };