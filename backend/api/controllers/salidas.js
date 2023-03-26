/**
 * CONTROLLER: Salidas
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

const elementosPorPagina = 10;

// --------------------------------


// * ================== GET ======================

/**
 * Responde con información básica paginada de clubes.
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
        req.query.texto = `%${req.query.texto}%`;
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "(s.nombre LIKE ? OR s.descripcion LIKE ? )";
        parameters.push( req.query.texto );
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
        filter += "p.cod = ?";
        parameters.push( req.query.cpro );
    }


    if( req.query.p ){ // Se espera validado y procesado como entero
        filter += ` ORDER BY id LIMIT ?, ${elementosPorPagina}`;
        parameters.push( req.query.p * elementosPorPagina );
    } else {
        filter += ` ORDER BY id LIMIT 0, ${elementosPorPagina}`;
    }

    // Query
    adminConnection.query(
`SELECT s.id, s.nombre, s.organizador,
s.itinerario, s.club,
s.fecha_inicio, s.fecha_fin,
s.privada, s.cancelada,
l.codauto, l.cpro,
a.nombre AS nombreauto, pro.nombre AS nombrepro,
(p.salida IS NOT NULL) AS is_participante,
NOT(p.pendiente IS NULL || p.pendiente = 0) AS is_invitado,
(SELECT COUNT(*) FROM participa_en AS p WHERE s.id = p.salida) AS n_participantes
FROM salidas AS s
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
                logRequest( req , 'getClubes' , HTTP.error_server.internal , 'Error al obtener los clubes' );
            } else {
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
const getSalida = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`SELECT s.id, s.nombre, s.organizador,
s.itinerario, s.club,
s.fecha_inicio, s.fecha_fin,
s.privada, s.cancelada,
l.codauto, l.cpro,
a.nombre AS nombreauto, pro.nombre AS nombrepro,
(p.salida IS NOT NULL) AS is_participante,
NOT(p.pendiente IS NULL || p.pendiente = 0) AS is_invitado,
(SELECT COUNT(*) FROM participa_en AS p WHERE s.id = p.salida) AS n_participantes
FROM salidas AS s
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
                logRequest( req , 'getClub' , HTTP.error_server.internal , 'Error al obtener el recurso' );
            } else {
                // Si no ha habido coincidencias se indica
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'getClub', HTTP.error_client.not_found );
                    return;
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
 * Crea una nueva salida.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
 const createSalida = async( req , res ) => {
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
                logRequest( req , 'createSalida' , HTTP.error_server.internal , 'Error al insertar el recurso' );
            } else {
                // Si no ha habido coincidencias se indica
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).json( { msg: 'No existe localidad para esa autonomía y provincia' } );
                    logRequest( req , 'createSalida', HTTP.error_client.not_found , 'No existe localidad para esa autonomía y provincia' );
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
                            logRequest( req , 'createSalida' , HTTP.error_server.internal , 'Error al insertar el club' );
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
                            logRequest( req , 'createSalida', HTTP.success.ok );
                        }
                    }
                );
            }
        }
    );
}

// -----------------------------------------------


// * ================= PATCH =====================



// -----------------------------------------------


// * ================= DELETE ====================



// -----------------------------------------------





const updateSalida = () => {}
const deleteSalida = () => {}
const inscribirseSalida = () => {}
const desinscribirseSalida = () => {}
const invitarSalida = () => {}
const desinvitarSalida = () => {}

// Marcar los metodos para exportar
module.exports = { getSalidas, getSalida,
    createSalida, updateSalida, deleteSalida,
    inscribirseSalida, desinscribirseSalida,
    invitarSalida, desinvitarSalida };