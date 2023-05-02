/**
 * CONTROLLER: Itinerarios
 */

// === IMPORTAR ===

// Librerias de terceros


// Propio
const { adminConnection } = require( '../services/database.js' ); // Base de datos
const { HTTP } = require( '../helpers/constantes.js' ); // Constantes
const { resolveURL } = require( '../helpers/metodos.js' ); // Metodos generales
const { logRequest } = require( '../helpers/log.js' ); // Registro
const { pfpURL } = require( '../middleware/files.js' );
const { RUTAMASKFULL } = require( '../helpers/rutas.js' ); // Rutas

// ----------------


// === INICIALIZAR

const elementosPorPagina = 20;

// --------------------------------


// * ================== GET ======================

/**
 * Responde con información básica paginada de itinerarios.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getItinerarios = async( req , res ) => {
    // Construir filtro SQL
    let filter = '';
    let parameters = [];
    let firstQuery = true;

    if( req.query.cod ){
        req.query.cod = `%${req.query.cod}%`;
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "i.cod LIKE ?";
        parameters.push( req.query.cod );
    }
    
    if( req.query.texto ){
        req.query.texto = `*${req.query.texto}*`; // Comodines
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += 'MATCH( denominacion, descripcion ) AGAINST( ? IN BOOLEAN MODE )';
        parameters.push( req.query.texto );
    }

    if( req.query.codauto ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "a.cod = ?";
        parameters.push( req.query.codauto );
    }

    if( req.query.cpro ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "p.cod = ?";
        parameters.push( req.query.cpro );
    }

    if( req.query.dificultad ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "i.dificultad = ?";
        parameters.push( req.query.dificultad );
    }


    if( req.query.dist_min ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "i.distancia >= ?";
        parameters.push( req.query.dist_min );
    }

    if( req.query.dist_max ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "i.distancia <= ?";
        parameters.push( req.query.dist_max );
    }


    if( req.query.desn_min ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "i.desnivel >= ?";
        parameters.push( req.query.desn_min );
    }

    if( req.query.desn_max ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "i.desnivel <= ?";
        parameters.push( req.query.desn_max );
    }


    if( req.query.tiempo_min ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "i.tiempo >= ?";
        parameters.push( req.query.tiempo_min );
    }

    if( req.query.tiempo_max ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "i.tiempo <= ?";
        parameters.push( req.query.tiempo_max );
    }


    if( req.query.circular !== undefined ){
        req.query.circular = Number( req.query.circular );
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "i.circular = ?";
        parameters.push( req.query.circular );
    }


    if( req.query.p ){ // Se espera validado y procesado como entero
        filter += ` ORDER BY id LIMIT ?, ${elementosPorPagina}`;
        parameters.push( req.query.p * elementosPorPagina );
    } else {
        filter += ` ORDER BY id LIMIT 0, ${elementosPorPagina}`;
    }

    // Query
    adminConnection.query(
`SELECT i.id, i.cod, i.denominacion, i.distancia, i.desnivel, i.dificultad,
l.codauto, l.cpro,
a.nombre AS autonomia, p.nombre AS provincia
FROM itinerarios AS i
INNER JOIN localidades AS l ON i.localidad = l.id
INNER JOIN autonomias AS a ON l.codauto = a.cod
LEFT JOIN provincias AS p ON l.cpro = p.cod
${filter}` ,
parameters ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getItinerarios' , HTTP.error_server.internal , 'Error al obtener los itinerarios' );
            } else {
                res.status( HTTP.success.ok ).json( {
                    itinerarios: result,
                    paginado: {
                        actual: ( req.query.p ) ? req.query.p : 0
                    }
                } );
                logRequest( req , 'getItinerarios', HTTP.success.ok );
            }
        }
    );
}

/**
 * Obtiene un itinerario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getItinerario = async( req , res ) => {
    // Distingue los identificadores
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`SELECT i.*,
l.codauto, l.cpro,
a.nombre AS autonomia, p.nombre AS provincia
FROM itinerarios AS i
INNER JOIN localidades AS l ON i.localidad = l.id
INNER JOIN autonomias AS a ON l.codauto = a.cod
LEFT JOIN provincias AS p ON l.cpro = p.cod
WHERE i.id = ?`,
        [ idObjetivo ],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'getItinerario' , HTTP.error_server.internal , 'Error al obtener el recurso' );
            } else {
                // Si no ha habido coincidencias se indica
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'getItinerario', HTTP.error_client.not_found );
                    return;
                }

                res.status( HTTP.success.ok ).json( result[ 0 ] );
                logRequest( req , 'getItinerario', HTTP.success.ok );
            }
        }
    );
}

/**
 * Obtiene las reseñas de un itinerario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getResenas = async( req , res ) => {
    // Distingue los identificadores
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`SELECT r.*, u.usuario AS autornombre, u.imagen AS autorimagen

FROM resenas AS r
INNER JOIN usuarios AS u ON r.usuario = u.id
WHERE itinerario = ?
ORDER BY fecha DESC`,
        [ idObjetivo ],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getResenas' , HTTP.error_server.internal , 'Error al obtener el recurso' );
            } else {
                // Resolver URLs de fotos de perfil
                for( let i = 0 ; i < result.length ; i++ ){
                    if( result[ i ].autorimagen ){
                        result[ i ].autorimagen = resolveURL( result[ i ].autorimagen , `${RUTAMASKFULL}${pfpURL}` , -4 );
                    }
                }

                res.status( HTTP.success.ok ).json( result );
                logRequest( req , 'getResenas', HTTP.success.ok );
            }
        }
    );
}

// -----------------------------------------------


// * ================== POST =====================

/**
 * Reseña un itienrario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const createResena = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = req.params.id;

    // Obtiene otras variables
    const valoracionResena = req.body.valoracion;
    const observacionesResena = req.body.observaciones;
    const ahora = new Date();

    // Query
    adminConnection.query(
`INSERT INTO resenas(
	usuario, itinerario, valoracion, observaciones, fecha
) VALUES (
	?, ?, ?, ?, ?
)`, [
    idSolicitante, idObjetivo, valoracionResena, observacionesResena, ahora
],
        ( err , result ) => {
            if( err ){
                if( err.errno === 1062 ){
                    res.status( HTTP.error_client.bad_request ).json( { msg: 'Ya has reseñado este itinerario' } );
                    logRequest( req , 'createResena' , HTTP.error_client.bad_request , 'Ya has reseñado este itinerario' );
                } else if( err.errno === 1452 ) {
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'createResena' , HTTP.error_client.not_found );
                } else {
                    console.error( err );
                    res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                    logRequest( req , 'createResena' , HTTP.error_server.internal , 'Error al insertar el recurso' );
                }
            } else {
                const resenaInsertada = {};

                resenaInsertada.id = result.insertId;
                resenaInsertada.usuario = idSolicitante;
                resenaInsertada.itinerario = idObjetivo;
                resenaInsertada.valoracion = valoracionResena;
                resenaInsertada.observaciones = observacionesResena;
                resenaInsertada.fecha = ahora;

                res.status( HTTP.success.ok ).json( resenaInsertada );
                logRequest( req , 'createResena' , HTTP.success.ok );
            }
        }
    );
}

// -----------------------------------------------


// * ================= DELETE ====================

/**
 * Elimina una reseña de un itinerario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
 const deleteResena = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idItObjetivo = req.params.itId;
    const idUserObjetivo = req.params.userId;

    // Comprueba que es el propietario
    if( ( idSolicitante !== idUserObjetivo ) && // No es él mismo y
        ( req.user.isAdmin !== true ) ){    // no es administrador
        res.status( HTTP.error_client.forbidden ).json( { msg: 'No cuentas con los permisos necesarios para realizar esta acción' } );
        logRequest( req , 'validateSensitiveActionUser' , HTTP.error_client.forbidden , 'El solicitante no es el propietario del recurso o un administrador' );
        return;
    }

    // Intenta eliminar el usuario
    adminConnection.query(
        'DELETE FROM resenas WHERE itinerario = ? AND usuario = ?' ,
        [ idItObjetivo, idSolicitante ] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'deleteResena' , HTTP.error_server.internal , 'Error al eliminar la reseña' );
            } else {
                if( result.affectedRows === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'deleteResena' , HTTP.error_client.not_found );
                } else {
                    res.status( HTTP.success.no_content ).send();
                    logRequest( req , 'deleteResena' , HTTP.success.no_content );
                }
            }
        }
    );
}

// -----------------------------------------------







// Marcar los metodos para exportar
module.exports = { getItinerarios, getItinerario,
    getResenas, createResena, deleteResena };