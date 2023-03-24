/**
 * HELPER: Métodos de uso general
 */

// === IMPORTAR ===

// Librerias
const path = require( 'path' ); // Rutas

// Propio

// ----------------


// POSIX utiliza "/", Windows utiliza "\\" y "/"
const universalPathSeparator = '/';



/**
 * Elimina parametros de URL no admitidos de un objeto de parametros.
 * 
 * @param {object} queries Objeto de parámetros de URL de la peticion (`req.query` en Express)
 * @param {string[]} accepted Nombre de los parámetros de URL aceptados ([ 'before' , 'after' , etc ]). Vacío devuelve el mismo objeto.
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
 * Quita campos de un objeto u array de objetos.
 * 
 * @param {object | object[]} resources Array con los objetos u objeto suelto.
 * @param {string[]} blacklistedFields Campos por eliminar. Si está vacío no se hace nada.
 */
const pullFields = ( resources , blacklistedFields = [] ) => {
    if( blacklistedFields.length === 0 ) return;
    if( typeof resources === 'array' ){
        for( let i = 0 ; i < resources.length ; ++i ){
            for( let j = 0 ; j < blacklistedFields.length ; ++j ){
                delete resources[ i ][ blacklistedFields[ j ] ];
            }
        }
    } else {
        for( let j = 0 ; j < blacklistedFields.length ; ++j ){
            delete resources[ blacklistedFields[ j ] ];
        }
    }
}

/**
 * Quita campos de un objeto u array de objetos.
 * 
 * @param {object | object[]} resources Array con los objetos u objeto suelto.
 * @param {string[]} whitelistedFields Campos por mantener. Si está vacío no se hace nada.
 * 
 * @return Array u objeto modificado.
 */
const keepFields = ( resources , whitelistedFields = [] ) => {
    if( whitelistedFields.length === 0 ) return;
    if( Array.isArray( resources ) === true ){
        for( let i = 0 ; i < resources.length ; ++i ){
            const filteredResource = {};

            for( let j = 0 ; j < whitelistedFields.length ; ++j ){
                filteredResource[ whitelistedFields[ j ] ] = resources[ i ][ whitelistedFields[ j ] ];
            }

            resources[ i ] = filteredResource;
        }
    } else {
        const filteredResource = {};

        for( let j = 0 ; j < whitelistedFields.length ; ++j ){
            filteredResource[ whitelistedFields[ j ] ] = resources[ whitelistedFields[ j ] ];
        }

        resources = filteredResource;
    }

    return resources;
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
 * @param {string} maskURL URL máscara hasta el directorio de recursos. NO debe contener el separador.
 * @param {number} keepElementCount (Opcional) Cuántos elementos de la URL original se deben conservar expresado como entero negativo.
 * Útil para mantener directorios basados en fecha (p. ej. "YYYY/MM/DD/archivo.jpg" en lugar de "archivo.jpg"). Por defecto sólo el propio archivo.
 * 
 * @return {string}
 */
 const resolveURL = ( path , maskURL , keepElementCount = -1 ) => {
    // Normaliza el filtro.
    if( keepElementCount > -1 ) keepElementCount = -1;

    // Ej: { http://127.0.0.1:3000 }{ / }{ assets/img/posts }{ / }{ 2023/2/17/image.jpg }
    return `${maskURL}${path.split( universalPathSeparator ).slice( keepElementCount ).join( universalPathSeparator ) }`;
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
module.exports = { filterQueries , pullFields, keepFields,
    getRandomInt , getRandomIntInclusive ,
    universalPathSeparator , toUniversalPath , getCaller , resolveURL };