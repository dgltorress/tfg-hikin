/**
 * CONTROLLER: Clubes
 */

// === IMPORTAR ===

// Librerias de terceros
const { relative } = require( 'path' ); // Rutas relativas

// Propio
const { adminConnection } = require( '../services/database.js' ); // Base de datos
const { HTTP } = require( '../helpers/constantes.js' ); // Constantes
const { resolveURL, toUniversalPath } = require( '../helpers/metodos.js' ); // Metodos generales
const { logRequest } = require( '../helpers/log.js' ); // Registro
const { deleteClubImage, clubURL } = require( '../middleware/files.js' );
const { RUTAMASKFULL } = require( '../helpers/rutas.js' ); // Rutas

// ----------------


// === INICIALIZAR

const elementosPorPagina = 20;

// --------------------------------


// * ================== GET ======================

/**
 * Responde con información básica paginada de clubes.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getClubes = async( req , res ) => {
    // Construir filtro SQL
    let filter = '';
    const parameters = [];
    let firstQuery = true;

    // Distingue los identificadores
    const idSolicitante = req.user.id;
    parameters.push( idSolicitante );

    if( req.query.texto ){
        req.query.texto = `*${req.query.texto}*`; // Comodines
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += 'MATCH( c.nombre, c.descripcion ) AGAINST( ? IN BOOLEAN MODE )';
        parameters.push( req.query.texto );
    }

    if( req.query.propietario ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "c.propietario = ?";
        parameters.push( req.query.propietario );
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

    if( req.query.privado ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "c.privado = ?";
        parameters.push( req.query.privado );
    }


    if( req.query.p ){ // Se espera validado y procesado como entero
        filter += ` ORDER BY id LIMIT ?, ${elementosPorPagina}`;
        parameters.push( req.query.p * elementosPorPagina );
    } else {
        filter += ` ORDER BY id LIMIT 0, ${elementosPorPagina}`;
    }

    // Query
    adminConnection.query(
`SELECT c.id, c.nombre, c.imagen, c.privado,
l.codauto, l.cpro,
a.nombre AS nombreauto, p.nombre AS nombrepro,
(m.club IS NOT NULL) AS is_miembro,
NOT(m.pendiente IS NULL || m.pendiente = 0) AS is_invitado,
(SELECT COUNT(*) FROM miembro_de AS m WHERE c.id = m.club) AS n_miembros
FROM clubes AS c
INNER JOIN localidades AS l ON c.localidad = l.id
INNER JOIN autonomias AS a ON l.codauto = a.cod
LEFT JOIN provincias AS p ON l.cpro = p.cod
LEFT JOIN miembro_de AS m ON m.club = c.id AND m.usuario = ?
${filter}` ,
parameters ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getClubes' , HTTP.error_server.internal , 'Error al obtener los clubes' );
            } else {
                // Resolver URLs de imágenes de club
                for( let i = 0 ; i < result.length ; i++ ){
                    if( result[ i ].imagen ){
                        result[ i ].imagen = resolveURL( result[ i ].imagen , `${RUTAMASKFULL}${clubURL}` , -4 );
                    }
                }

                res.status( HTTP.success.ok ).json( {
                    clubes: result,
                    paginado: {
                        actual: ( req.query.p ) ? req.query.p : 0
                    }
                } );
                logRequest( req , 'getClubes', HTTP.success.ok );
            }
        }
    );
}

/**
 * Obtiene un club.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getClub = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`SELECT c.*,
l.codauto, l.cpro,
a.nombre AS nombreauto, p.nombre AS nombrepro,
(m.club IS NOT NULL) AS is_miembro,
NOT(m.pendiente IS NULL || m.pendiente = 0) AS is_invitado,
(SELECT COUNT(*) FROM miembro_de AS m WHERE c.id = m.club) AS n_miembros
FROM clubes AS c
INNER JOIN localidades AS l ON c.localidad = l.id
INNER JOIN autonomias AS a ON l.codauto = a.cod
LEFT JOIN provincias AS p ON l.cpro = p.cod
LEFT JOIN miembro_de AS m ON m.club = c.id AND m.usuario = ?
WHERE c.id = ?`,
        [ idObjetivo, idSolicitante ],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'getClub' , HTTP.error_server.internal , 'Error al obtener el recurso' );
            } else {
                // Si no ha habido coincidencias se indica
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'getClub', HTTP.error_client.not_found );
                    return;
                }

                // Resolver URLs de imagen de club
                if( result[ 0 ].imagen ){
                    result[ 0 ].imagen = resolveURL( result[ 0 ].imagen , `${RUTAMASKFULL}${clubURL}` , -4 );
                }

                res.status( HTTP.success.ok ).json( result[ 0 ] );
                logRequest( req , 'getClub', HTTP.success.ok );
            }
        }
    );
}

// -----------------------------------------------


// * ================== POST =====================

/**
 * Crea un nuevo club.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const createClub = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;

    // Obtiene la información del cuerpo de la petición
    let { nombre, descripcion, codauto, cpro, privado } = req.body;

    // Variables extra
    let proComparator;
    if( cpro !== undefined ){
        proComparator = '=';
    } else {
        proComparator = 'IS';
        cpro = null;
    }

    // Obtiene la localidad que coincide con la autonomía y la provincia recibidas
    adminConnection.query(
`SELECT id, codauto, cpro FROM localidades
WHERE codauto = ? AND cpro ${proComparator} ?`,
        [ codauto , cpro ],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'createClub' , HTTP.error_server.internal , 'Error al insertar el recurso' );
            } else {
                // Si no ha habido coincidencias se indica
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).json( { msg: 'No existe localidad para esa autonomía y provincia' } );
                    logRequest( req , 'createClub', HTTP.error_client.not_found , 'No existe localidad para esa autonomía y provincia' );
                    return;
                }

                // Intenta insertar el nuevo club con su información
                adminConnection.query(
`INSERT INTO clubes(
  nombre, descripcion,
  localidad, propietario,
  privado, imagen
) VALUES (
  ?, ?,
  ?, ?,
  ?, ?
)` , [
    nombre, descripcion,
    result[ 0 ].id, idSolicitante,
    privado, null
] ,
                    ( err , result2 ) => {
                        if( err ){
                            console.error( err );
                            res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                            logRequest( req , 'createClub' , HTTP.error_server.internal , 'Error al insertar el club' );
                        } else {
                            // Construye un objeto usuario que devolver
                            const insertedObject = {};
                        
                            insertedObject.id = result2.insertId;
                            insertedObject.nombre = nombre;
                            insertedObject.descripcion = descripcion;
                            insertedObject.codauto = codauto;
                            insertedObject.cpro = cpro;
                            insertedObject.localidad = result[ 0 ].id;
                            insertedObject.privado = privado;
                            insertedObject.imagen = null;
                        
                            // Responde con el objeto usuario, el token y su expiración
                            res.status( HTTP.success.ok ).json( insertedObject );
                            logRequest( req , 'createClub', HTTP.success.ok );
                        }
                    }
                );
            }
        }
    );
}

/**
 * Inscribe al solicitante en un club.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const inscribirseClub = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = req.params.id;

    // Comprueba si está invitado
    adminConnection.query(
`SELECT
(SELECT privado FROM clubes WHERE id = ?) AS privado,
(SELECT pendiente FROM miembro_de WHERE usuario = ? AND club = ?) AS pendiente` , [
    idObjetivo, idSolicitante, idObjetivo
] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'inscribirseClub' , HTTP.error_server.internal , 'Error' );
            } else {
                // No se ha encontrado
                if( result[ 0 ].privado === null ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'inscribirseClub', HTTP.error_client.not_found );
                    return;
                }

                // No está en el club ni tiene invitación (insertar)
                if( result[ 0 ].pendiente === null ){
                    // No se puede inscribir directamente en un club privado
                    if( result[ 0 ].privado === 1 ){
                        res.status( HTTP.error_client.forbidden ).json( { msg: 'Este club es privado y requiere de invitación' } );
                        logRequest( req , 'inscribirseClub' , HTTP.error_client.forbidden , 'Club privado' );
                        return;
                    }

                    adminConnection.query(
`INSERT INTO miembro_de(
    usuario, club, pendiente
) VALUES (
    ?, ?, false
)` , [
    idSolicitante, idObjetivo
] ,
                            ( err , result ) => {
                                if( err && ( err.errno !== 1062 ) ){
                                    console.error( err );
                                    res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                                    logRequest( req , 'inscribirseClub' , HTTP.error_server.internal , 'Error al insertar' );
                                } else {
                                    res.status( HTTP.success.no_content ).json();
                                    logRequest( req , 'inscribirseClub' , HTTP.success.no_content , 'Inscripción directa' );
                                }
                            }
                        );
                // Está invitado al club pero no había aceptado (poner pendiente a false)
                } else if( result[ 0 ].pendiente === 1 ){
                    adminConnection.query(
`UPDATE miembro_de
SET pendiente = false
WHERE usuario = ?` , [
    idSolicitante
] ,
                        ( err , result ) => {
                            if( err ){
                                console.error( err );
                                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                                logRequest( req , 'inscribirseClub' , HTTP.error_server.internal , 'Error al actualizar' );
                            } else {
                                res.status( HTTP.success.no_content ).json();
                                logRequest( req , 'inscribirseClub' , HTTP.success.no_content , 'Inscripción por invitación' );
                            }
                        }
                    );
                // Ya está dentro (no hacer nada)
                } else {
                    res.status( HTTP.success.no_content ).json();
                    logRequest( req , 'inscribirseClub' , HTTP.success.no_content );
                }
            }
        }
    );
}

/**
 * Invita a un usuario a un club.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const invitarClub = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idClubObjetivo = req.params.clubId;
    const idUserObjetivo = req.params.userId;

    // Comprueba si es el propietario
    adminConnection.query(
        'SELECT propietario FROM clubes WHERE id = ?' ,
        [ idClubObjetivo ] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'invitarClub' , HTTP.error_server.internal , 'Error' );
            } else {
                // No encontrado
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'invitarClub', HTTP.error_client.not_found );
                    return;
                }

                // Solicitante es propietario o admin
                if( ( result[ 0 ].propietario === idSolicitante ) ||
                    ( req.user.isAdmin === true ) ){
                        adminConnection.query(
`INSERT INTO miembro_de(
    usuario, club, pendiente
) VALUES (
    ?, ?, true
)` , [
    idUserObjetivo, idClubObjetivo
] ,
                        ( err , result ) => {
                            if( err && ( err.errno !== 1062 ) ){
                                console.error( err );
                                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                                logRequest( req , 'invitarClub' , HTTP.error_server.internal , 'Error al insertar' );
                            } else {
                                res.status( HTTP.success.no_content ).json();
                                logRequest( req , 'invitarClub' , HTTP.success.no_content );
                            }
                        }
                    );
                } else {
                    res.status( HTTP.error_client.forbidden ).json( { msg: 'Sólo el propietario de un club puede invitar a nuevos miembros' } );
                    logRequest( req , 'invitarClub' , HTTP.error_client.forbidden , 'Solicitante no propietario o admin' );
                }
            }
        }
    );
}

/**
 * Prepara para cambiar la imagen de club.
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
        'SELECT propietario FROM clubes WHERE propietario = ?' ,
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
                if( ( result[ 0 ].propietario !== idSolicitante ) &&
                    ( req.user.isAdmin !== true ) ){
                    res.status( HTTP.error_client.forbidden ).json( { msg: 'No cuentas con los permisos necesarios para realizar esta acción' } );
                    logRequest( req , 'cambiarImagen' , HTTP.error_client.forbidden , 'El solicitante no es el propietario del recurso o un administrador' );
                    return;
                }

                next();
            }
        }
    );
}

/**
 * Maneja los eventos posteriores a la subida de imagen de club.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const cambiarImagenResponse = async( req , res ) => {
    // Distingue los identificadores
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
        'SELECT imagen FROM clubes WHERE id = ?' ,
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
                    if( result[ 0 ].imagen !== null ) deleteClubImage( result[ 0 ].imagen );
                
                    // Construye la URL de la imagen.
                    let imageUniversalURL = toUniversalPath( relative( '.' , req.file.path ) );
                
                    // Se asigna el nuevo archivo
                    adminConnection.query(
                        'UPDATE clubes SET imagen = ? WHERE id = ?' ,
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
                                    logRequest( req , 'cambiarImagenResponse' , HTTP.error_client.not_found , 'Club encontrado en SELECT pero no en UPDATE' );
                                } else {
                                    // Se resuelve la URL y se devuelve.
                                    imageUniversalURL = resolveURL( imageUniversalURL, `${RUTAMASKFULL}${clubURL}`, -4 );

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


// * ================= PATCH =====================

/**
 * Actualiza la información de un club.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const updateClub = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = parseInt( req.params.id );

    // Obtiene la información del cuerpo de la petición
    let { nombre, descripcion, codauto, cpro, privado } = req.body;

    // Variables extra
    let autoComparator;
    if( codauto !== undefined ){
        autoComparator = '=';
    } else {
        autoComparator = 'IS';
        codauto = null;
    }

    let proComparator;
    if( cpro !== undefined ){
        proComparator = '=';
    } else {
        proComparator = 'IS';
        cpro = null;
    }

    // Obtiene la localidad que coincide con la autonomía y la provincia recibidas
    adminConnection.query(
`SELECT c.propietario, l.id AS localidad FROM clubes AS c
LEFT JOIN localidades AS l ON l.codauto ${autoComparator} ? AND l.cpro ${proComparator} ?
WHERE c.id = ?` ,
        [ codauto , cpro, idObjetivo ],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'updateClub' , HTTP.error_server.internal , 'Error al insertar el recurso' );
            } else {
                // Si no ha habido coincidencias se indica
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'updateClub', HTTP.error_client.not_found );
                    return;
                }
                
                // Se comprueba que el usuario sea el propietario o un administrador
                if( ( result[ 0 ].propietario !== idSolicitante ) &&
                    ( req.user.isAdmin !== true ) ){
                    res.status( HTTP.error_client.forbidden ).json( { msg: 'No cuentas con los permisos necesarios para realizar esta acción' } );
                    logRequest( req , 'updateClub' , HTTP.error_client.forbidden , 'El solicitante no es el propietario del recurso o un administrador' );
                    return;
                }

                // Si se quiere editar la localidad pero no existe se indica
                if( codauto && ( result[ 0 ].localidad === null ) ){
                    res.status( HTTP.error_client.not_found ).json( { msg: 'No existe localidad para esa autonomía y provincia' } );
                    logRequest( req , 'updateClub', HTTP.error_client.not_found , 'No existe localidad para esa autonomía y provincia' );
                    return;
                }

                // Construct SQL filter
                let filter = '';
                const parameters = [];
                let firstQuery = true;

                if( nombre ){
                    if( firstQuery === true ){
                        filter += " SET ";
                        firstQuery = false;
                    } else {
                        filter += ", ";
                    }
                    filter += "nombre = ?";
                    parameters.push( nombre );
                }

                if( descripcion ){
                    if( firstQuery === true ){
                        filter += " SET ";
                        firstQuery = false;
                    } else {
                        filter += ", ";
                    }
                    filter += "descripcion = ?";
                    parameters.push( descripcion );
                }

                if( codauto ){
                    if( firstQuery === true ){
                        filter += " SET ";
                        firstQuery = false;
                    } else {
                        filter += ", ";
                    }
                    filter += "localidad = ?";
                    parameters.push( result[ 0 ].localidad );
                }

                if( privado ){
                    if( firstQuery === true ){
                        filter += " SET ";
                        firstQuery = false;
                    } else {
                        filter += ", ";
                    }
                    filter += "privado = ?";
                    parameters.push( privado );
                }

                parameters.push( idObjetivo );

                if( filter !== '' ){
                    // Intenta insertar el nuevo club con su información
                    adminConnection.query(
                        `UPDATE clubes ${filter} WHERE id = ?` , parameters ,
                        ( err , result2 ) => {
                            if( err ){
                                console.error( err );
                                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                                logRequest( req , 'updateClub' , HTTP.error_server.internal , 'Error al actualizar el club' );
                            } else {
                                // Construye un objeto que devolver
                                const insertedObject = {};
                            
                                insertedObject.id = idObjetivo;
                                insertedObject.nombre = nombre;
                                insertedObject.descripcion = descripcion;
                                insertedObject.codauto = codauto;
                                insertedObject.cpro = cpro;
                                insertedObject.localidad = result[ 0 ].id;
                                insertedObject.privado = privado;
                                insertedObject.imagen = null;
                            
                                // Responde con el objeto
                                res.status( HTTP.success.ok ).json( insertedObject );
                                logRequest( req , 'updateClub', HTTP.success.ok );
                            }
                        }
                    );
                } else {
                    res.status( HTTP.success.no_content ).send();
                    logRequest( req , 'updateClub', HTTP.success.no_content );
                }
            }
        }
    );
}

// -----------------------------------------------


// * ================= DELETE ====================

/**
 * Elimina un club.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const deleteClub = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = req.params.id;

    // Encuentra al propietario del recurso
    adminConnection.query(
        'SELECT propietario FROM clubes WHERE id = ?' ,
        [ idObjetivo ] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'deleteClub' , HTTP.error_server.internal , 'Error al eliminar el recurso' );
            } else {
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'deleteClub' , HTTP.error_client.not_found );
                } else {
                    // Es propietario del recurso o administrador
                    if( ( result[ 0 ].propietario === idSolicitante ) ||
                        ( req.user.isAdmin === true ) ){
                        // Intenta eliminar la publicación
                        adminConnection.query(
                            'DELETE FROM clubes WHERE id = ?' ,
                            [ idObjetivo ] ,
                            ( err , result ) => {
                                if( err ){
                                    console.error( err );
                                    res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                                    logRequest( req , 'deleteClub' , HTTP.error_server.internal , 'Error al eliminar el recurso' );
                                } else {
                                    if( result.affectedRows === 0 ){
                                        res.status( HTTP.error_client.not_found ).send();
                                        logRequest( req , 'deleteClub' , HTTP.error_client.not_found );
                                    } else {
                                        res.status( HTTP.success.no_content ).send();
                                        logRequest( req , 'deleteClub' , HTTP.success.no_content );
                                    }
                                }
                            }
                        );
                    } else {
                        res.status( HTTP.error_client.forbidden ).json( { msg: 'No cuentas con los permisos necesarios para realizar esta acción' } );
                        logRequest( req , 'deleteClub' , HTTP.error_client.forbidden , 'El solicitante no es el propietario del recurso o un administrador' );
                    }
                }
            }
        }
    );
}

/**
 * Desinscribe al solicitante de un club.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const desinscribirseClub = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`DELETE FROM miembro_de
WHERE usuario = ? AND club = ?` , [
    idSolicitante, idObjetivo
] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'desinscribirseClub' , HTTP.error_server.internal , 'Error al eliminar el recurso' );
            } else {
                res.status( HTTP.success.no_content ).json();
                logRequest( req , 'desinscribirseClub' , HTTP.success.no_content );
            }
        }
    );
}

/**
 * Revoca la invitación a un club de un usuario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const desinvitarClub = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idClubObjetivo = req.params.clubId;
    const idUserObjetivo = req.params.userId;

    // Comprueba si es el propietario
    adminConnection.query(
        'SELECT propietario FROM clubes WHERE id = ?' ,
        [ idClubObjetivo ] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'desinvitarClub' , HTTP.error_server.internal , 'Error' );
            } else {
                // No encontrado
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'desinvitarClub', HTTP.error_client.not_found );
                    return;
                }

                // Solicitante es propietario o admin
                if( ( result[ 0 ].propietario === idSolicitante ) ||
                    ( req.user.isAdmin === true ) ){
                        adminConnection.query(
                        'DELETE FROM miembro_de WHERE usuario = ? AND club = ?',
                        [ idUserObjetivo, idClubObjetivo ],
                        ( err , result ) => {
                            if( err ){
                                console.error( err );
                                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                                logRequest( req , 'desinvitarClub' , HTTP.error_server.internal , 'Error al eliminar' );
                            } else {
                                res.status( HTTP.success.no_content ).json();
                                logRequest( req , 'desinvitarClub' , HTTP.success.no_content );
                            }
                        }
                    );
                } else {
                    res.status( HTTP.error_client.forbidden ).json( { msg: 'Sólo el propietario de un club puede eliminar miembros' } );
                    logRequest( req , 'desinvitarClub' , HTTP.error_client.forbidden , 'Solicitante no propietario o admin' );
                }
            }
        }
    );
}

/**
 * Eliminar una imagen de club.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const borrarImagen = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
        'SELECT propietario, imagen FROM clubes WHERE id = ?' ,
        [ idObjetivo ],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'borrarImagen' , HTTP.error_server.internal , 'Error' );
            } else {
                // Si no ha habido coincidencias se indica
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'borrarImagen' , HTTP.error_client.not_found );
                    return;
                }

                // Si el usuario que tiene el recurso que se solicita cambiar no es el solicitante
                // y el solicitante no es administrador, no se hace
                if( ( result[ 0 ].propietario !== idSolicitante ) &&
                    ( req.user.isAdmin !== true ) ){
                    res.status( HTTP.error_client.forbidden ).json( { msg: 'No cuentas con los permisos necesarios para realizar esta acción' } );
                    logRequest( req , 'borrarImagen' , HTTP.error_client.forbidden , 'El solicitante no es el propietario del recurso o un administrador' );
                    return;
                }

                // No tiene imagen; se puede considerar un éxito
                if( result[ 0 ].imagen === null ){
                    res.status( HTTP.success.no_content ).send();
                    logRequest( req , 'borrarImagen' , HTTP.success.no_content );
                    return;
                }

                deleteClubImage( result[ 0 ].imagen );

                adminConnection.query(
                    'UPDATE clubes SET imagen = NULL WHERE id = ?' ,
                    [ idObjetivo ],
                    ( err , result ) => {
                        if( err ){
                            console.error( err );
                            res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                            logRequest( req , 'borrarImagen' , HTTP.error_server.internal , 'Error' );
                        } else {
                            if( result.affectedRows === 0 ){
                                res.status( HTTP.error_client.not_found ).send();
                                logRequest( req , 'borrarImagen' , HTTP.success.not_found );
                            } else {
                                res.status( HTTP.success.no_content ).send();
                                logRequest( req , 'borrarImagen' , HTTP.success.no_content );
                            }
                        }
                    }
                );
            }
        }
    );
}

// -----------------------------------------------







// Marcar los metodos para exportar
module.exports = { getClubes, getClub,
    createClub, updateClub, deleteClub,
    inscribirseClub, desinscribirseClub,
    invitarClub, desinvitarClub,
    cambiarImagen, cambiarImagenResponse,
    borrarImagen };