/**
 * HELPER: Métodos de uso general
 */

// === IMPORTAR ===

// Librerias
const { Blob } = require( 'buffer' );           // Objetos binarios de gran tamano
const path = require( 'path' );                 // Rutas

// Propio


// ----------------


// POSIX utiliza "/", Windows utiliza "\\" y "/"
const universalPathSeparator = '/';



/**
 * Obtiene la IP del cliente como entero.
 * 
 * @param {*} req Petición del cliente.
 */
const getIp = function( req ){
    // Devuelve la IP resuelta por Express
    // o la IP del ultimo cliente que envio la peticion (que bien podria ser un proxy relegandola)
    return ( req.ip || req.connection.remoteAddress );
}


/**
 * Elimina parametros de URL no admitidos de un objeto de parametros.
 * 
 * @param {*} queries Objeto de parametros de URL de la peticion (req.query en Express)
 * @param {string array} accepted Nombre de los parametros de URL aceptados ([ 'before' , 'after' , etc ]). Vacio devuelve el mismo objeto.
 * 
 * @returns {*} Objeto de parametros filtrados.
 */
const filterQueries = ( queries , accepted = [] ) => {
    if( accepted.length === 0 ) return query;
    if( typeof queries === 'object' ){
        let filteredQueries = {};

        for( let i = 0 ; i < accepted.length ; i++ ){
            let query = queries[ accepted[ i ] ];
            if( query ) filteredQueries[ accepted[ i ] ] = query;
        }

        return filteredQueries;
    }
    else{
        console.warn( `Parametros de llamada al metodo filterQueries() erroneos (queries: ${queries}) NO es un objeto` );
    }
    return null;
}

/**
 * Quita campos de un recurso que no conviene enviar al cliente.
 * 
 * @param {object | object[]} resources Array con los recursos.
 * @param {string[]} fields Campos por eliminar.
 */
 const pullFields = ( resources , fields = [] ) => {
    if( typeof resources === 'array' ){
        for( let i = 0 ; i < resources.length ; ++i ){
            for( let j = 0 ; j < fields.length ; ++j ){
                delete resources[ i ][ fields[ j ] ];
            }
        }
    } else {
        for( let j = 0 ; j < fields.length ; ++j ){
            delete resources[ fields[ j ] ];
        }
    }
}

/**
 * Genera un objeto con propiedades $gte y $lt para filtrar por fecha en mongoose.
 * 
 * @param {*} start Fecha minima
 * @param {*} end Fecha maxima
 */
const generateMongooseDateFilter = ( start , end ) => {
    // Crea un objeto al que asignar propiedades.
    dateFilter = {};

    // Comprueba y anade las fechas.
    if( !isNaN( Date.parse( start ) ) ) dateFilter.$gte = start;
    if( !isNaN( Date.parse( end   ) ) ) dateFilter.$lte = end;
    
    // Si el objeto final no tiene propiedades, a efectos practicos no existe.
    if( Object.keys( dateFilter ).length === 0 ) dateFilter = undefined;

    return dateFilter;
}


/**
 * Genera un entero aleatorio entre dos valores, minimo inclusive y maximo exclusive.
 * Funcion obtenida de https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * 
 * @param {number} min Valor minimo.
 * @param {number} max Valor maximo.
 * @returns Valor entero aleatorio intermedio.
 */
function getRandomInt( min , max ) {
    min = Math.ceil( min );
    max = Math.floor( max );

    return Math.floor( Math.random() * ( max - min ) + min );
}


/**
 * Genera un entero aleatorio entre dos valores, ambos inclusive.
 * Funcion obtenida de https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * 
 * @param {number} min Valor minimo.
 * @param {number} max Valor maximo.
 * @returns Valor entero aleatorio intermedio.
 */
function getRandomIntInclusive( min , max ) {
    min = Math.ceil( min );
    max = Math.floor( max );

    return Math.floor( Math.random() * ( max - min + 1 ) + min );
}

/**
 * Devuelve el tamano de un string en bytes.
 * Obtenido de https://dev.to/rajnishkatharotiya/get-byte-size-of-the-string-in-javascript-20jm
 * 
 * @param {string} str String a evaluar.
 */
const stringByteSize = str => new Blob( [ str ] ).size;

/**
 * Convierte una ruta en universal.
 * 
 * @param {string} weirdPath Ruta por convertir.
 * @returns Ruta convertida.
 */
const toUniversalPath = ( weirdPath ) => {
    return weirdPath.split( path.sep ).join( universalPathSeparator );
}

/**
 * Resuelve la URL a un recurso en base a una URL.
 * 
 * @param {string} path Ruta relativa o absoluta al recurso local.
 * @param {string} maskBaseURL URL máscara base del servidor. NO debe contener separadores en los extremos.
 * @param {string} maskURL URL máscara base del directorio de recursos. NO debe contener separadores en los extremos.
 * @param {number} keepElementCount (Opcional) Cuántos elementos de la URL original se deben conservar expresado como entero negativo.
 * Útil para mantener directorios basados en fecha (p. ej. "YYYY/MM/DD/archivo.jpg" en lugar de "archivo.jpg"). Por defecto sólo el propio archivo.
 * 
 * @return {string}
 */
 const resolveURL = ( path , maskBaseURL , maskURL , keepElementCount = -1 ) => {
    // Normaliza el filtro.
    if( keepElementCount > -1 ) keepElementCount = -1;

    // Ej: { http://127.0.0.1:3000 }{ / }{ assets/img/posts }{ / }{ 2023/2/17/image.jpg }
    return `${maskBaseURL}${universalPathSeparator}${maskURL}${universalPathSeparator}${path.split( universalPathSeparator ).slice( keepElementCount ).join( universalPathSeparator ) }`;
}

/**
 * Muestra por pantalla/devuelve el nombre de quien haya llamado a una función.
 * 
 * @param {number} stackDepth Profundidad del stack.
 */
const getCaller = ( stackDepth ) => {
    try{
        return new Error().stack.split("at ")[++stackDepth].split(" ")[ 0 ].trim();
    } catch( err ){
        console.error( err );
        return null;
    }
}



// Marcar los metodos para exportar
module.exports = { getIp , filterQueries , pullFields, generateMongooseDateFilter ,
    getRandomInt , getRandomIntInclusive , stringByteSize ,
    universalPathSeparator , toUniversalPath , getCaller , resolveURL };