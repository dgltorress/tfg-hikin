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
 * Obtiene la IP del cliente.
 * 
 * @param {*} req Peticion del cliente.
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
 * Muestra por pantalla el nombre de quien haya llamado a una función.
 * 
 * @param {number} stackDepth Profundidad del stack.
 */
const getCaller = ( stackDepth ) => {
    console.log( "DEBUG", (new Error().stack.split("at ")[++stackDepth]).trim() );
}



// Marcar los metodos para exportar
module.exports = { getIp , filterQueries , generateMongooseDateFilter ,
    joinSwaggerDocs , getRandomInt , getRandomIntInclusive , stringByteSize ,
    universalPathSeparator , toUniversalPath , getCaller };