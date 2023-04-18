/**
 * CONTROLLER: Salidas
 */

// === IMPORTAR ===

// Librerias de terceros


// Propio
const { adminConnection } = require( '../services/database.js' ); // Base de datos
const { HTTP } = require( '../helpers/constantes.js' ); // Constantes
const { logRequest } = require( '../helpers/log.js' ); // Registro
const { resolveURL } = require( '../helpers/metodos.js' ); // Metodos generales
const { pfpURL } = require( '../middleware/files.js' );
const { RUTAMASKFULL } = require( '../helpers/rutas.js' ); // Rutas


// ----------------


// === INICIALIZAR

const elementosPorPagina = 10;

// --------------------------------


// * ================== GET ======================

/**
 * Responde con información básica paginada de salidas.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
 const getSalidas = async( req , res ) => {
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
        filter += 'MATCH( s.nombre, s.descripcion ) AGAINST( ? IN BOOLEAN MODE )';
        parameters.push( req.query.texto );
    }


    if( req.query.organizador ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "s.organizador = ?";
        parameters.push( req.query.organizador );
    }

    if( req.query.itinerario ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "s.itinerario = ?";
        parameters.push( req.query.itinerario );
    }

    if( req.query.itinerario ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "s.itinerario = ?";
        parameters.push( req.query.itinerario );
    }


    if( req.query.desde ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "s.fecha_inicio > ?";
        parameters.push( req.query.desde );
    }

    if( req.query.hasta ){
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "s.fecha_inicio < ?";
        parameters.push( req.query.hasta );
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
        filter += "pro.cod = ?";
        parameters.push( req.query.cpro );
    }


    if( req.query.p ){ // Se espera validado y procesado como entero
        filter += ` ORDER BY s.fecha_inicio DESC LIMIT ?, ${elementosPorPagina}`;
        parameters.push( req.query.p * elementosPorPagina );
    } else {
        filter += ` ORDER BY s.fecha_inicio DESC LIMIT 0, ${elementosPorPagina}`;
    }

    // Query
    adminConnection.query(
`SELECT s.id, s.nombre, s.organizador, u.usuario AS organizadornombre, u.imagen AS organizadorimagen,
s.itinerario, i.denominacion AS itinerariodenominacion,
s.club, (SELECT nombre FROM clubes WHERE id = s.club) AS clubnombre,
s.fecha_inicio, s.fecha_fin,
s.privada, s.cancelada,
l.codauto, l.cpro,
a.nombre AS nombreauto, pro.nombre AS nombrepro,
(p.salida IS NOT NULL) AS is_participante,
NOT(p.pendiente IS NULL || p.pendiente = 0) AS is_invitado,
(SELECT COUNT(*) FROM participa_en AS p WHERE s.id = p.salida) AS n_participantes
FROM salidas AS s
INNER JOIN usuarios AS u ON s.organizador = u.id
INNER JOIN itinerarios AS i ON s.itinerario = i.id
INNER JOIN localidades AS l ON i.localidad = l.id
INNER JOIN autonomias AS a ON l.codauto = a.cod
LEFT JOIN provincias AS pro ON l.cpro = pro.cod
LEFT JOIN participa_en AS p ON p.salida = s.id AND p.usuario = ?
${filter}` ,
parameters ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getSalidas' , HTTP.error_server.internal , 'Error al obtener las salidas' );
            } else {
                // Resolver URLs de fotos de perfil
                for( let i = 0 ; i < result.length ; i++ ){
                    if( result[ i ].organizadorimagen ){
                        result[ i ].organizadorimagen = resolveURL( result[ i ].organizadorimagen , `${RUTAMASKFULL}${pfpURL}` , -4 );
                    }
                }

                res.status( HTTP.success.ok ).json( {
                    salidas: result,
                    paginado: {
                        actual: ( req.query.p ) ? req.query.p : 0
                    }
                } );
                logRequest( req , 'getSalidas', HTTP.success.ok );
            }
        }
    );
}

/**
 * Obtiene una salida.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getSalida = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`SELECT s.id, s.nombre, s.descripcion, s.organizador, u.usuario AS organizadornombre, u.imagen AS organizadorimagen,
s.itinerario, i.denominacion AS itinerariodenominacion,
s.club, (SELECT nombre FROM clubes WHERE id = s.club) AS clubnombre,
s.fecha_inicio, s.fecha_fin,
s.privada, s.cancelada,
l.codauto, l.cpro,
a.nombre AS nombreauto, pro.nombre AS nombrepro,
(p.salida IS NOT NULL) AS is_participante,
NOT(p.pendiente IS NULL || p.pendiente = 0) AS is_invitado,
(SELECT COUNT(*) FROM participa_en AS p WHERE s.id = p.salida) AS n_participantes
FROM salidas AS s
INNER JOIN usuarios AS u ON s.organizador = u.id
INNER JOIN itinerarios AS i ON s.itinerario = i.id
INNER JOIN localidades AS l ON i.localidad = l.id
INNER JOIN autonomias AS a ON l.codauto = a.cod
LEFT JOIN provincias AS pro ON l.cpro = pro.cod
LEFT JOIN participa_en AS p ON p.salida = s.id AND p.usuario = ?
WHERE s.id = ?`,
        [ idSolicitante, idObjetivo ],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'getSalida' , HTTP.error_server.internal , 'Error al obtener el recurso' );
            } else {
                // Si no ha habido coincidencias se indica
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'getSalida', HTTP.error_client.not_found );
                    return;
                }

                // Resolver URLs de fotos de perfil
                for( let i = 0 ; i < result.length ; i++ ){
                    if( result[ 0 ].organizadorimagen ){
                        result[ 0 ].organizadorimagen = resolveURL( result[ 0 ].organizadorimagen , `${RUTAMASKFULL}${pfpURL}` , -4 );
                    }
                }

                res.status( HTTP.success.ok ).json( result[ 0 ] );
                logRequest( req , 'getSalida', HTTP.success.ok );
            }
        }
    );
}

/**
 * Obtiene información básica de los participantes de una salida.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getParticipantes = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`SELECT u.id, u.usuario, u.nombre, u.imagen, u.privado,
(s.seguidor IS NOT NULL) AS is_siguiendo,
(SELECT COUNT(*) FROM sigue_a WHERE seguido = u.id) AS n_seguidores

FROM participa_en AS p

INNER JOIN usuarios AS u
ON p.usuario = u.id

LEFT JOIN sigue_a AS s
ON u.id = s.seguido AND s.seguidor = ?

WHERE p.salida = ? AND p.pendiente = 0` , [
    idSolicitante,
    idObjetivo
] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getParticipantes' , HTTP.error_server.internal , 'Error al obtener los usuarios' );
            } else {
                // Resolver URLs de fotos de perfil
                for( let i = 0 ; i < result.length ; i++ ){
                    if( result[ i ].imagen ){
                        result[ i ].imagen = resolveURL( result[ i ].imagen , `${RUTAMASKFULL}${pfpURL}` , -4 );
                    }
                }

                res.status( HTTP.success.ok ).json( result );
                logRequest( req , 'getParticipantes', HTTP.success.ok );
            }
        }
    );
}


// -----------------------------------------------


// * ================== POST =====================

/**
 * Crea una nueva salida.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const createSalida = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;

    // Obtiene la información del cuerpo de la petición
    let { nombre, descripcion, itinerario, club, fecha_inicio, fecha_fin, privada } = req.body;

    if( club === undefined ) club = null;
    if( privada === undefined ) privada = false;

    // Obtiene el itinerario que coincide con el identificador recibido
    adminConnection.query(
`SELECT id FROM itinerarios
WHERE id = ?`,
[ itinerario ],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'createSalida' , HTTP.error_server.internal , 'Error' );
            } else {
                // Si no ha habido coincidencias se indica
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).json( { msg: 'No existe un itinerario con ese ID' } );
                    logRequest( req , 'createSalida', HTTP.error_client.not_found , 'No existe un itinerario con ese ID' );
                    return;
                }
    
                // Intenta insertar la nueva salida con su información
                adminConnection.query(
`INSERT INTO salidas(
  nombre, descripcion,
  organizador,
  itinerario, club,
  fecha_inicio, fecha_fin,
  privada
) VALUES (
  ?, ?,
  ?,
  ?, ?,
  ?, ?,
  ?
)` , [
    nombre, descripcion,
    idSolicitante,
    itinerario, club,
    fecha_inicio, fecha_fin,
    privada
] ,
                    ( err , result ) => {
                        if( err ){
                            if( err.errno === 1452 ){
                                res.status( HTTP.error_client.not_found ).json( { msg: 'No existe un club con ese ID' } );
                                logRequest( req , 'createSalida', HTTP.error_client.not_found , 'No existe un club con ese ID' );
                            } else {
                                console.error( err );
                                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                                logRequest( req , 'createSalida' , HTTP.error_server.internal , 'Error al crear la salida' );
                            }
                        } else {
                            // Intenta hacer participar automáticamente al organizador
                            adminConnection.query(
`INSERT INTO participa_en ( usuario, salida, pendiente )
VALUES ( ?, ?, 0 )` , [
    idSolicitante, result.insertId
] ,
                                ( err , result2 ) => {
                                    if( err ){
                                        console.error( err );
                                        res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                                        logRequest( req , 'createSalida' , HTTP.error_server.internal , 'Error al hacer participar al organizador' );
                                    } else {
                                        
                                        // Construye un objeto usuario que devolver
                                        const insertedObject = {};
                                    
                                        insertedObject.id = result2.insertId;
                                        insertedObject.nombre = nombre;
                                        insertedObject.descripcion = descripcion;
                                        insertedObject.organizador = idSolicitante;
                                        insertedObject.itinerario = itinerario;
                                        insertedObject.club = club;
                                        insertedObject.fecha_inicio = fecha_inicio;
                                        insertedObject.fecha_fin = fecha_fin;
                                        insertedObject.privada = privada;
                                        insertedObject.cancelada = false;
                                    
                                        // Responde con el objeto usuario, el token y su expiración
                                        res.status( HTTP.success.ok ).json( insertedObject );
                                        logRequest( req , 'createSalida', HTTP.success.ok );
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
}

/**
 * Crea un conjunto de valoraciones.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const createValoraciones = async( req , res ) => {
    // No atiende cuerpos vacíos
    if( req.body.length === 0 ){
        res.status( HTTP.success.no_content ).send();
        logRequest( req, 'createValoraciones', HTTP.success.no_content, 'Ninguna valoración proporcionada' );
        return;
    }

    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = parseInt( req.params.id );

    // Comprueba si el solicitante ha acudido a la salida y si ya existe un conjunto
    adminConnection.query(
`SELECT p.pendiente, s.fecha_fin
FROM participa_en AS p
INNER JOIN salidas AS s
ON p.salida = s.id
WHERE p.usuario = ? AND p.salida = ?` ,
[ idSolicitante, idObjetivo ] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'createValoraciones' , HTTP.error_server.internal , 'Error' );
            } else {
                // === COMPROBACIONES

                // No encontrado
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).json( { msg: 'No has participado en esta salida' } );
                    logRequest( req, 'createValoraciones', HTTP.error_client.not_found, 'No ha participado' );
                    return;
                }

                // No ha aceptado la invitación
                if( result[ 0 ].pendiente === 1 ){
                    res.status( HTTP.error_client.forbidden ).json( { msg: 'No has aceptado la invitación a esta salida' } );
                    logRequest( req, 'createValoraciones', HTTP.error_client.forbidden, 'No ha aceptado invitación' );
                    return;
                }

                // La salida no ha finalizado
                const fechaFinSalida = result[ 0 ].fecha_fin;
                if( isNaN( fechaFinSalida ) === true ){
                    console.error( err );
                    res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                    logRequest( req , 'createValoraciones' , HTTP.error_server.internal , 'Error al procesar la fecha de la salida' );
                    return;
                } else if( fechaFinSalida > new Date() ) {
                    res.status( HTTP.error_client.bad_request ).json( { msg: `Sólo pueden enviarse valoraciones tras concluir la salida. Ésta concluirá en la siguiente fecha: ${fechaFinSalida}` } );
                    logRequest( req, 'createValoraciones', HTTP.error_client.bad_request, 'Salida no ha finalizado' );
                    return;
                }

                // Construye las instrucciones INSERT
                const body = req.body;
                const parameters = [];
                let inserts = '';

                for( let i = 0 ; i < body.length ; ++i ){
                    const currentItem = body[ i ];

                    // Comprobación de no valorarse a sí mismo
                    if( currentItem.valorado === idSolicitante ){
                        console.error( err );
                        res.status( HTTP.error_client.bad_request ).json( { msg: 'No puedes autovalorarte' } );
                        logRequest( req , 'createValoraciones' , HTTP.error_client.bad_request , 'Autovaloración' );
                        return;
                    }

                    inserts += '(?,?,?,?,?,?)';

                    parameters.push( idSolicitante );
                    parameters.push( currentItem.valorado );
                    parameters.push( idObjetivo );
                    parameters.push( currentItem.acude );
                    parameters.push( currentItem.valoracion );
                    parameters.push( ( currentItem.observaciones !== undefined ) ? currentItem.observaciones : null );

                    if( i+1 < body.length ) inserts += ', ';
                } inserts += ';';
                

                // Insertar las valoraciones
                adminConnection.query(
`INSERT INTO valoraciones (
  valorador, valorado, salida,
  acude, valoracion,
  observaciones
) VALUES ${inserts}` , parameters ,
                    ( err , result ) => {
                        if( err ){
                            if( err.errno === 1062 ){
                                res.status( HTTP.error_client.bad_request ).json( { msg: 'Al menos una de las valoraciones ya existe' } );
                                logRequest( req , 'createValoraciones' , HTTP.error_client.bad_request , 'Al menos una valoración ya existe' );
                            } else {
                                console.error( err );
                                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                                logRequest( req , 'createValoraciones' , HTTP.error_server.internal , 'Error al insertar el conjunto' );
                            }
                        } else {
                            res.status( HTTP.success.no_content ).send();
                            logRequest( req , 'createValoraciones' , HTTP.success.no_content );
                        }
                    }
                );
            }
        }
    );
}

/**
 * Inscribe al solicitante en una salida.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const inscribirseSalida = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = parseInt( req.params.id );

    // Comprueba si está invitado
    adminConnection.query(
`SELECT
(SELECT privada FROM salidas WHERE id = ?) AS privada,
(SELECT pendiente FROM participa_en WHERE usuario = ? AND salida = ?) AS pendiente` , [
    idObjetivo, idSolicitante, idObjetivo
] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'inscribirseSalida' , HTTP.error_server.internal , 'Error' );
            } else {
                // No se ha encontrado
                if( result[ 0 ].privada === null ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'inscribirseSalida', HTTP.error_client.not_found );
                    return;
                }

                // No está en la salida ni tiene invitación (insertar)
                if( result[ 0 ].pendiente === null ){
                    // No se puede inscribir directamente en una salida privada
                    if( result[ 0 ].privada === 1 ){
                        res.status( HTTP.error_client.forbidden ).json( { msg: 'Esta salida es privada y requiere de invitación' } );
                        logRequest( req , 'inscribirseSalida' , HTTP.error_client.forbidden , 'Salida privada' );
                        return;
                    }

                    adminConnection.query(
`INSERT INTO participa_en(
    usuario, salida, pendiente
) VALUES (
    ?, ?, false
)` , [
    idSolicitante, idObjetivo
] ,
                            ( err , result ) => {
                                if( err && ( err.errno !== 1062 ) ){
                                    console.error( err );
                                    res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                                    logRequest( req , 'inscribirseSalida' , HTTP.error_server.internal , 'Error al insertar' );
                                } else {
                                    res.status( HTTP.success.no_content ).json();
                                    logRequest( req , 'inscribirseSalida' , HTTP.success.no_content , 'Inscripción directa' );
                                }
                            }
                        );
                // Está invitado a la salida pero no había aceptado (poner pendiente a false)
                } else if( result[ 0 ].pendiente === 1 ){
                    adminConnection.query(
`UPDATE participa_en
SET pendiente = false
WHERE usuario = ?` , [
    idSolicitante
] ,
                        ( err , result ) => {
                            if( err ){
                                console.error( err );
                                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                                logRequest( req , 'inscribirseSalida' , HTTP.error_server.internal , 'Error al actualizar' );
                            } else {
                                res.status( HTTP.success.no_content ).json();
                                logRequest( req , 'inscribirseSalida' , HTTP.success.no_content , 'Inscripción por invitación' );
                            }
                        }
                    );
                // Ya está dentro (no hacer nada)
                } else {
                    res.status( HTTP.success.no_content ).json();
                    logRequest( req , 'inscribirseSalida' , HTTP.success.no_content );
                }
            }
        }
    );
}

/**
 * Invita a un usuario a un salida.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const invitarSalida = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idSalObjetivo = parseInt( req.params.salId );
    const idUserObjetivo = parseInt( req.params.userId );

    // Comprueba si es el propietario
    adminConnection.query(
        'SELECT organizador FROM salidas WHERE id = ?' ,
        [ idSalObjetivo ] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'invitarSalida' , HTTP.error_server.internal , 'Error' );
            } else {
                // No encontrado
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'invitarSalida', HTTP.error_client.not_found );
                    return;
                }

                // Solicitante es propietario o admin
                if( ( result[ 0 ].organizador === idSolicitante ) ||
                    ( req.user.isAdmin === true ) ){
                        adminConnection.query(
`INSERT INTO participa_en(
    usuario, salida, pendiente
) VALUES (
    ?, ?, true
)` , [
    idUserObjetivo, idSalObjetivo
] ,
                        ( err , result ) => {
                            if( err && ( err.errno !== 1062 ) ){
                                console.error( err );
                                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                                logRequest( req , 'invitarSalida' , HTTP.error_server.internal , 'Error al insertar' );
                            } else {
                                res.status( HTTP.success.no_content ).json();
                                logRequest( req , 'invitarSalida' , HTTP.success.no_content );
                            }
                        }
                    );
                } else {
                    res.status( HTTP.error_client.forbidden ).json( { msg: 'Sólo el propietario de una salida puede invitar a nuevos miembros' } );
                    logRequest( req , 'invitarSalida' , HTTP.error_client.forbidden , 'Solicitante no propietario o admin' );
                }
            }
        }
    );
}

// -----------------------------------------------


// * ================= PATCH =====================

/**
 * Actualiza la información de una salida.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const updateSalida = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = parseInt( req.params.id );

    // Obtiene la información del cuerpo de la petición
    let { nombre, descripcion, itinerario, club, fecha_inicio, fecha_fin, privada, cancelada } = req.body;

    // Obtiene la localidad que coincide con la autonomía y la provincia recibidas
    adminConnection.query(
        'SELECT organizador FROM salidas WHERE id = ?' ,
        [ idObjetivo ],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'updateSalida' , HTTP.error_server.internal , 'Error al insertar el recurso' );
            } else {
                // Si no ha habido coincidencias se indica
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'updateSalida', HTTP.error_client.not_found );
                    return;
                }
                
                // Se comprueba que el usuario sea el propietario o un administrador
                if( ( result[ 0 ].organizador !== idSolicitante ) &&
                    ( req.user.isAdmin !== true ) ){
                    res.status( HTTP.error_client.forbidden ).json( { msg: 'No cuentas con los permisos necesarios para realizar esta acción' } );
                    logRequest( req , 'updateSalida' , HTTP.error_client.forbidden , 'El solicitante no es el propietario del recurso o un administrador' );
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


                if( itinerario ){
                    if( firstQuery === true ){
                        filter += " SET ";
                        firstQuery = false;
                    } else {
                        filter += ", ";
                    }
                    filter += "itinerario = ?";
                    parameters.push( itinerario );
                }

                if( club ){
                    if( firstQuery === true ){
                        filter += " SET ";
                        firstQuery = false;
                    } else {
                        filter += ", ";
                    }
                    filter += "club = ?";
                    parameters.push( club );
                }


                if( fecha_inicio ){
                    if( firstQuery === true ){
                        filter += " SET ";
                        firstQuery = false;
                    } else {
                        filter += ", ";
                    }
                    filter += "fecha_inicio = ?";
                    parameters.push( fecha_inicio );
                }

                if( fecha_fin ){
                    if( firstQuery === true ){
                        filter += " SET ";
                        firstQuery = false;
                    } else {
                        filter += ", ";
                    }
                    filter += "fecha_fin = ?";
                    parameters.push( fecha_fin );
                }


                if( privada ){
                    if( firstQuery === true ){
                        filter += " SET ";
                        firstQuery = false;
                    } else {
                        filter += ", ";
                    }
                    filter += "privada = ?";
                    parameters.push( privada );
                }

                if( cancelada ){
                    if( firstQuery === true ){
                        filter += " SET ";
                        firstQuery = false;
                    } else {
                        filter += ", ";
                    }
                    filter += "cancelada = ?";
                    parameters.push( cancelada );
                }

                parameters.push( idObjetivo );

                if( filter !== '' ){
                    // Intenta insertar la nueva salida con su información
                    adminConnection.query(
                        `UPDATE salidas ${filter} WHERE id = ?` , parameters ,
                        ( err , result2 ) => {
                            if( err ){
                                if( err.errno === 1452 ){
                                    res.status( HTTP.error_client.not_found ).json( { msg: 'No existe un itinerario o club con ese ID' } );
                                    logRequest( req , 'updateSalida', HTTP.error_client.not_found , 'No existe un itinerario o club con ese ID' );
                                } else {
                                    console.error( err );
                                    res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                                    logRequest( req , 'updateSalida' , HTTP.error_server.internal , 'Error al actualizar la salida' );
                                }
                            } else {
                                // Construye un objeto que devolver
                                const insertedObject = {};
                                
                                insertedObject.id = idObjetivo;
                                insertedObject.nombre = nombre;
                                insertedObject.descripcion = descripcion;
                                insertedObject.organizador = idSolicitante;
                                insertedObject.itinerario = itinerario;
                                insertedObject.club = club;
                                insertedObject.fecha_inicio = fecha_inicio;
                                insertedObject.fecha_fin = fecha_fin;
                                insertedObject.privada = privada;
                                insertedObject.cancelada = cancelada;
                                
                                // Responde con el objeto
                                res.status( HTTP.success.ok ).json( insertedObject );
                                logRequest( req , 'updateSalida', HTTP.success.ok );
                            }
                        }
                    );
                } else {
                    res.status( HTTP.success.no_content ).send();
                    logRequest( req , 'updateSalida', HTTP.success.no_content );
                }
            }
        }
    );
}

// -----------------------------------------------


// * ================= DELETE ====================

/**
 * Elimina una salida.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const deleteSalida = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = req.params.id;

    // Encuentra al propietario del recurso
    adminConnection.query(
        'SELECT organizador FROM salidas WHERE id = ?' ,
        [ idObjetivo ] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'deleteSalida' , HTTP.error_server.internal , 'Error al eliminar el recurso' );
            } else {
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'deleteSalida' , HTTP.error_client.not_found );
                } else {
                    // Es propietario del recurso o administrador
                    if( ( result[ 0 ].organizador === idSolicitante ) ||
                        ( req.user.isAdmin === true ) ){
                        // Intenta eliminar la publicación
                        adminConnection.query(
                            'DELETE FROM salidas WHERE id = ?' ,
                            [ idObjetivo ] ,
                            ( err , result ) => {
                                if( err ){
                                    console.error( err );
                                    res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                                    logRequest( req , 'deleteSalida' , HTTP.error_server.internal , 'Error al eliminar el recurso' );
                                } else {
                                    if( result.affectedRows === 0 ){
                                        res.status( HTTP.error_client.not_found ).send();
                                        logRequest( req , 'deleteSalida' , HTTP.error_client.not_found );
                                    } else {
                                        res.status( HTTP.success.no_content ).send();
                                        logRequest( req , 'deleteSalida' , HTTP.success.no_content );
                                    }
                                }
                            }
                        );
                    } else {
                        res.status( HTTP.error_client.forbidden ).json( { msg: 'No cuentas con los permisos necesarios para realizar esta acción' } );
                        logRequest( req , 'deleteSalida' , HTTP.error_client.forbidden , 'El solicitante no es el propietario del recurso o un administrador' );
                    }
                }
            }
        }
    );
}

/**
 * Desinscribe al solicitante de una salida.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const desinscribirseSalida = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = parseInt( req.params.id );

    // Query
    adminConnection.query(
`DELETE FROM participa_en
WHERE usuario = ? AND salida = ?` , [
    idSolicitante, idObjetivo
] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'desinscribirseSalida' , HTTP.error_server.internal , 'Error al eliminar el recurso' );
            } else {
                res.status( HTTP.success.no_content ).json();
                logRequest( req , 'desinscribirseSalida' , HTTP.success.no_content );
            }
        }
    );
}

/**
 * Revoca la invitación a una salida de un usuario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const desinvitarSalida = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idSalObjetivo = req.params.salId;
    const idUserObjetivo = req.params.userId;

    // Comprueba si es el propietario
    adminConnection.query(
        'SELECT organizador FROM salidas WHERE id = ?' ,
        [ idSalObjetivo ] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'desinvitarSalida' , HTTP.error_server.internal , 'Error' );
            } else {
                // No encontrado
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'desinvitarSalida', HTTP.error_client.not_found );
                    return;
                }

                // Solicitante es propietario o admin
                if( ( result[ 0 ].organizador === idSolicitante ) ||
                    ( req.user.isAdmin === true ) ){
                        adminConnection.query(
                        'DELETE FROM participa_en WHERE usuario = ? AND salida = ?',
                        [ idUserObjetivo, idSalObjetivo ],
                        ( err , result ) => {
                            if( err ){
                                console.error( err );
                                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                                logRequest( req , 'desinvitarSalida' , HTTP.error_server.internal , 'Error al eliminar' );
                            } else {
                                res.status( HTTP.success.no_content ).json();
                                logRequest( req , 'desinvitarSalida' , HTTP.success.no_content );
                            }
                        }
                    );
                } else {
                    res.status( HTTP.error_client.forbidden ).json( { msg: 'Sólo el propietario de una salida puede eliminar miembros' } );
                    logRequest( req , 'desinvitarSalida' , HTTP.error_client.forbidden , 'Solicitante no propietario o admin' );
                }
            }
        }
    );
}

// -----------------------------------------------




// Marcar los metodos para exportar
module.exports = { getSalidas, getSalida, getParticipantes,
    createSalida, updateSalida, deleteSalida,
    inscribirseSalida, desinscribirseSalida,
    createValoraciones,
    invitarSalida, desinvitarSalida };