/**
 * CONTROLLER: Publicaciones
 */

// === IMPORTAR ===

// Librerias de terceros
const { relative } = require( 'path' ); // Rutas relativas

// Propio
const { adminConnection } = require( '../services/database.js' ); // Base de datos
const { HTTP } = require( '../helpers/constantes.js' ); // Constantes
const { resolveURL, toUniversalPath } = require( '../helpers/metodos.js' ); // Metodos generales
const { logRequest } = require( '../helpers/log.js' ); // Registro
const { deletePostImage, postURL } = require( '../middleware/files.js' );
const { RUTAMASKFULL } = require( '../helpers/rutas.js' ); // Rutas

// ----------------


// === INICIALIZAR

const elementosPorPagina = 10;

// --------------------------------


// * ================== GET ======================

/**
 * Responde con información paginada de publicaciones.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getPublicaciones = async( req , res ) => {
    // Construir filtro SQL
    let filter = '';
    let parameters = [];
    let firstQuery = true;

    // Distingue los identificadores
    const idSolicitante = req.user.id;
    parameters.push( idSolicitante );
    
    if( req.query.texto ){
        req.query.texto = `%${req.query.texto}%`;
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "(titulo LIKE ? OR descripcion LIKE ? )";
        parameters.push( req.query.texto );
        parameters.push( req.query.texto );
    }

    if( req.query.autor ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "autor = ?";
        parameters.push( req.query.autor );
    }

    if( req.query.itinerario ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "itinerario = ?";
        parameters.push( req.query.itinerario );
    }

    if( req.query.club ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "club = ?";
        parameters.push( req.query.club );
    }

    if( req.query.desde ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "fecha > ?";
        parameters.push( req.query.desde );
    }

    if( req.query.hasta ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "fecha < ?";
        parameters.push( req.query.hasta );
    }

    if( req.query.p ){ // Se espera validado y procesado como entero
        filter += ` ORDER BY fecha DESC LIMIT ?, ${elementosPorPagina}`;
        parameters.push( req.query.p * elementosPorPagina );
    } else {
        filter += ` ORDER BY fecha DESC LIMIT 0, ${elementosPorPagina}`;
    }

    // Query
    adminConnection.query(
`SELECT p.*,
(k.publicacion IS NOT NULL) AS is_kudos,
(SELECT COUNT(*) FROM kudos WHERE p.id = publicacion) AS n_kudos,
(SELECT COUNT(*) FROM comentarios WHERE p.id = publicacion) AS n_comentarios
FROM publicaciones AS p
LEFT JOIN kudos AS k
ON p.id = k.publicacion AND k.usuario = ?
${filter}` ,
parameters ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getPublicaciones' , HTTP.error_server.internal , 'Error al obtener las publicaciones' );
            } else {
                // Resolver URLs de fotos de perfil
                for( let i = 0 ; i < result.length ; i++ ){
                    if( result[ i ].imagen ){
                        result[ i ].imagen = resolveURL( result[ i ].imagen , `${RUTAMASKFULL}/assets/img/posts/` , -4 );
                    }
                }

                res.status( HTTP.success.ok ).json( {
                    publicaciones: result,
                    paginado: {
                        actual: ( req.query.p ) ? req.query.p : 0
                    }
                } );
                logRequest( req , 'getPublicaciones', HTTP.success.ok );
            }
        }
    );
}

/**
 * Obtiene una publicación.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getPublicacion = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`SELECT p.*,
(k.publicacion IS NOT NULL) AS is_kudos,
(SELECT COUNT(*) FROM kudos WHERE p.id = publicacion) AS n_kudos,
(SELECT COUNT(*) FROM comentarios WHERE p.id = publicacion) AS n_comentarios
FROM publicaciones AS p
LEFT JOIN kudos AS k
ON p.id = k.publicacion AND k.usuario = ?
WHERE p.id = ?`,
        [ idSolicitante , idObjetivo ],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getPublicacion' , HTTP.error_server.internal , 'Error al obtener el recurso' );
            } else {
                // Si no ha habido coincidencias se indica
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'getPublicacion', HTTP.error_client.not_found );
                    return;
                }

                // Resolver URLs de imágenes
                if( result[ 0 ].imagen ){
                    result[ 0 ].imagen = resolveURL( result[ 0 ].imagen , `${RUTAMASKFULL}/assets/img/posts/` , -4 );
                }

                res.status( HTTP.success.ok ).json( result[ 0 ] );
                logRequest( req , 'getPublicacion', HTTP.success.ok );
            }
        }
    );
}

/**
 * Obtiene los comentarios de una publicación.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getComentarios = async( req , res ) => {
    // Distingue los identificadores
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`SELECT * FROM comentarios
WHERE publicacion = ?
ORDER BY fecha DESC`,
        [  idObjetivo ],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getComentarios' , HTTP.error_server.internal , 'Error al obtener el recurso' );
            } else {
                res.status( HTTP.success.ok ).json( result );
                logRequest( req , 'getComentarios', HTTP.success.ok );
            }
        }
    );
}

// -----------------------------------------------


// * ================== POST =====================

/**
 * Crea una publicación.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const createPublicacion = async( req , res ) => {

}

/**
 * Da kudos a una publicación.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const darKudos = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`INSERT INTO kudos(
  usuario, publicacion
) VALUES (
  ?, ?
)` , [
    idSolicitante, idObjetivo
] ,
        ( err , result ) => {
            if( err && ( err.errno !== 1062 ) ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'darKudos' , HTTP.error_server.internal , 'Error al insertar el recurso' );
            } else {
                res.status( HTTP.success.no_content ).json();
                logRequest( req , 'darKudos' , HTTP.success.no_content );
            }
        }
    );
}

/**
 * Comenta en una publicación.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const createComentario = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = req.params.id;

    // Obtiene otras variables
    const textoComentario = req.body.texto;
    const ahora = new Date();

    // Query
    adminConnection.query(
`INSERT INTO comentarios(
	publicacion, autor, texto, fecha
) VALUES (
	?, ?, ?, ?
)`, [
    idObjetivo, idSolicitante, textoComentario, ahora
],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'createComentario' , HTTP.error_server.internal , 'Error al insertar el recurso' );
            } else {
                const comentarioInsertado = {};

                comentarioInsertado.id = result.insertId;
                comentarioInsertado.publicacion = idObjetivo;
                comentarioInsertado.autor = idSolicitante;
                comentarioInsertado.texto = textoComentario;
                comentarioInsertado.fecha = ahora;

                res.status( HTTP.success.ok ).json( comentarioInsertado );
                logRequest( req , 'createComentario' , HTTP.success.ok );
            }
        }
    );
}

/**
 * Prepara para cambiar la imagen de perfil de un usuario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
 const cambiarImagen = async( req , res , next ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
        'SELECT autor, imagen FROM publicaciones WHERE id = ?' ,
        [ idObjetivo ],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'cambiarImagen' , HTTP.error_server.internal , 'Error' );
            } else {
                // Si no ha habido coincidencias se indica
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'cambiarImagen' , HTTP.error_client.not_found );
                    return;
                }

                // Si el usuario que tiene el recurso que se solicita cambiar no es el solicitante
                // y el solicitante no es administrador, no se hace
                if( ( result[ 0 ].autor !== idSolicitante ) &&
                    ( req.user.isAdmin !== true ) ){
                    res.status( HTTP.error_client.forbidden ).json( { msg: 'No cuentas con los permisos necesarios para realizar esta acción' } );
                    logRequest( req , 'cambiarImagen' , HTTP.error_client.forbidden , 'El solicitante no es el propietario del recurso o un administrador' );
                    return;
                }

                // Si ya tiene imagen, no se puede cambiar
                if( result[ 0 ].imagen !== null ){
                    res.status( HTTP.error_client.bad_request ).json( { msg: 'Esta publicación ya tiene una imagen asignada y no se puede cambiar' } );
                    logRequest( req , 'cambiarImagen' , HTTP.error_client.bad_request, 'Imagen ya asignada' );
                    return;
                }

                next();
            }
        }
    );
}

/**
 * Maneja los eventos posteriores a la subida de foto de perfil de un usuario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const cambiarImagenResponse = async( req , res ) => {
    // Distingue los identificadores
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
        'SELECT imagen FROM publicaciones WHERE id = ?' ,
        [ idObjetivo ],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'cambiarImagenResponse' , HTTP.error_server.internal , 'Error' );
            } else {
                // Si no ha habido coincidencias se indica
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'cambiarImagenResponse' , HTTP.error_client.not_found );
                    return;
                }

                // Si se ha subido una imagen,
                if( req.file ){
                    const newFileName = req.file.filename;
                
                    // se intenta borrar el archivo antiguo asignado (no se puede asumir que exista)
                    if( result[ 0 ].imagen !== null ) deletePostImage( result[ 0 ].imagen );
                
                    // Construye la URL de la imagen.
                    let imageUniversalURL = toUniversalPath( relative( '.' , req.file.path ) );
                
                    // Se asigna el nuevo archivo
                    adminConnection.query(
                        'UPDATE publicaciones SET imagen = ? WHERE id = ?' ,
                        [ imageUniversalURL , idObjetivo ],
                        ( err , result ) => {
                            if( err ){
                                console.error( err );
                                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                                logRequest( req , 'cambiarImagenResponse' , HTTP.error_server.internal , 'Error' );
                            } else {
                                // Si no ha habido coincidencias se indica
                                if( result.length === 0 ){
                                    res.status( HTTP.error_client.not_found ).send();
                                    logRequest( req , 'cambiarImagenResponse' , HTTP.error_client.not_found , 'Usuario encontrado en SELECT pero no en UPDATE' );
                                } else {
                                    // Se resuelve la URL y se devuelve.
                                    imageUniversalURL = resolveURL( imageUniversalURL, `${RUTAMASKFULL}${postURL}`, -4 );

                                    res.status( HTTP.success.ok ).json( { imagen: imageUniversalURL } );
                                    logRequest( req , 'changeImageResponse' , HTTP.success.ok , `Foto de perfil actualizada ("${newFileName}")` );
                                }
                            }
                        }
                    );
                }
                // Si no se ha subido una imagen,
                else{
                    // y no era un error,
                    if( !req.uploadErr ){
                        // se indica.
                        res.status( HTTP.error_client.bad_request ).json( { msg: 'El campo del formulario con la imagen está vacío' } );
                        logRequest( req , 'changeImageResponse' , HTTP.error_client.bad_request , 'Imagen vacía' );
                    }
                    // y ha habido un error,
                    else{
                        // se indica.
                        res.status( req.uploadErr.status ).json( { msg: req.uploadErr.msg } );
                        logRequest( req , 'changeImageResponse' , req.uploadErr.status , req.uploadErr.msg );
                    }
                }
            }
        }
    );
}

// -----------------------------------------------


// * ================= DELETE ====================

/**
 * Elimina una publicación.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const deletePublicacion = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = req.params.id;

    // Determina si el usuario posee el recurso o es administrador
    adminConnection.query(
        'SELECT autor FROM publicaciones WHERE id = ?' ,
        [ idObjetivo ] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'deletePublicacion' , HTTP.error_server.internal , 'Error al eliminar el recurso' );
            } else {
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'deletePublicacion' , HTTP.error_client.not_found );
                } else {
                    // Es propietario del recurso o administrador
                    if( ( result[ 0 ].autor === idSolicitante ) ||
                        ( req.user.isAdmin === true ) ){
                        // Intenta eliminar la publicación
                        adminConnection.query(
                            'DELETE FROM publicaciones WHERE id = ?' ,
                            [ idObjetivo ] ,
                            ( err , result ) => {
                                if( err ){
                                    console.error( err );
                                    res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                                    logRequest( req , 'deletePublicacion' , HTTP.error_server.internal , 'Error al eliminar el recurso' );
                                } else {
                                    if( result.affectedRows === 0 ){
                                        res.status( HTTP.error_client.not_found ).send();
                                        logRequest( req , 'deletePublicacion' , HTTP.error_client.not_found );
                                    } else {
                                        res.status( HTTP.success.no_content ).send();
                                        logRequest( req , 'deletePublicacion' , HTTP.success.no_content );
                                    }
                                }
                            }
                        );
                    } else {
                        res.status( HTTP.error_client.forbidden ).json( { msg: 'No cuentas con los permisos necesarios para realizar esta acción' } );
                        logRequest( req , 'deletePublicacion' , HTTP.error_client.forbidden , 'El solicitante no es el propietario del recurso o un administrador' );
                    }
                }
            }
        }
    );
}

/**
 * Elimina un comentario de una publicación.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const deleteComentario = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idPubObjetivo = req.params.pubId;
    const idComObjetivo = req.params.comId;

    // Encuentra al propietario del recurso
    adminConnection.query(
        'SELECT autor FROM comentarios WHERE publicacion = ? AND id = ?' ,
        [ idPubObjetivo, idComObjetivo ] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'deleteComentario' , HTTP.error_server.internal , 'Error al eliminar el recurso' );
            } else {
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'deleteComentario' , HTTP.error_client.not_found );
                } else {
                    // Es propietario del recurso o administrador
                    if( ( result[ 0 ].autor === idSolicitante ) ||
                        ( req.user.isAdmin === true ) ){
                        // Intenta eliminar la publicación
                        adminConnection.query(
                            'DELETE FROM comentarios WHERE publicacion = ? AND id = ?' ,
                            [ idPubObjetivo, idComObjetivo ] ,
                            ( err , result ) => {
                                if( err ){
                                    console.error( err );
                                    res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                                    logRequest( req , 'deleteComentario' , HTTP.error_server.internal , 'Error al eliminar el recurso' );
                                } else {
                                    if( result.affectedRows === 0 ){
                                        res.status( HTTP.error_client.not_found ).send();
                                        logRequest( req , 'deleteComentario' , HTTP.error_client.not_found );
                                    } else {
                                        res.status( HTTP.success.no_content ).send();
                                        logRequest( req , 'deleteComentario' , HTTP.success.no_content );
                                    }
                                }
                            }
                        );
                    } else {
                        res.status( HTTP.error_client.forbidden ).json( { msg: 'No cuentas con los permisos necesarios para realizar esta acción' } );
                        logRequest( req , 'deleteComentario' , HTTP.error_client.forbidden , 'El solicitante no es el propietario del recurso o un administrador' );
                    }
                }
            }
        }
    );
}

/**
 * Quita kudos a una publicación.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const quitarKudos = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`DELETE FROM kudos
WHERE usuario = ? AND publicacion = ?` , [
    idSolicitante,
    idObjetivo
] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'deseguirUsuario' , HTTP.error_server.internal , 'Error al eliminar el recurso' );
            } else {
                res.status( HTTP.success.no_content ).json();
                logRequest( req , 'deseguirUsuario' , HTTP.success.no_content );
            }
        }
    );
}

// -----------------------------------------------







// Marcar los metodos para exportar
module.exports = { getPublicaciones, createPublicacion,
    getPublicacion, deletePublicacion,
    darKudos, quitarKudos,
    getComentarios, createComentario, deleteComentario,
    cambiarImagen, cambiarImagenResponse };