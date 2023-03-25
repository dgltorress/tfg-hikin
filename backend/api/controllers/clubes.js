/**
 * CONTROLLER: Clubes
 */

// === IMPORTAR ===

// Librerias de terceros


// Propio
const { adminConnection } = require( '../services/database.js' ); // Base de datos
const { HTTP } = require( '../helpers/constantes.js' ); // Constantes
const { resolveURL } = require( '../helpers/metodos.js' ); // Metodos generales
const { logRequest } = require( '../helpers/log.js' ); // Registro
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

    if( req.query.texto ){
        req.query.texto = `%${req.query.texto}%`;
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "(c.nombre LIKE ? OR c.descripcion LIKE ? )";
        parameters.push( req.query.texto );
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
(SELECT COUNT(*) FROM miembro_de AS m WHERE c.id = m.club) AS n_miembros
FROM clubes AS c
INNER JOIN localidades AS l ON c.localidad = l.id
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
                logRequest( req , 'getClubes' , HTTP.error_server.internal , 'Error al obtener los clubes' );
            } else {
                // Resolver URLs de imágenes de club
                for( let i = 0 ; i < result.length ; i++ ){
                    if( result[ i ].imagen ){
                        result[ i ].imagen = resolveURL( result[ i ].imagen , `${RUTAMASKFULL}/assets/img/clubes/` , -4 );
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
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`SELECT c.*,
l.codauto, l.cpro,
a.nombre AS nombreauto, p.nombre AS nombrepro,
(SELECT COUNT(*) FROM miembro_de AS m WHERE c.id = m.club) AS n_miembros
FROM clubes AS c
INNER JOIN localidades AS l ON c.localidad = l.id
INNER JOIN autonomias AS a ON l.codauto = a.cod
LEFT JOIN provincias AS p ON l.cpro = p.cod
WHERE c.id = ?`,
        [ idObjetivo ],
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
                    result[ 0 ].imagen = resolveURL( result[ 0 ].imagen , `${RUTAMASKFULL}/assets/img/clubes/` , -4 );
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
    const idObjetivo = req.params.id;

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
                        logRequest( req , 'deleteComentario' , HTTP.error_client.forbidden , 'El solicitante no es el propietario del recurso o un administrador' );
                    }
                }
            }
        }
    );
}

// -----------------------------------------------







// Marcar los metodos para exportar
module.exports = { getClubes, getClub,
    createClub, updateClub, deleteClub };