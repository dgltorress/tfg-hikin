/**
 * CONTROLLER: Usuarios
 */

// === IMPORTAR ===

// Librerias de terceros
const bcrypt = require( 'bcrypt' ); // BcryptJS
const { toLong } = require( 'ip' ); // Pasar IPs a version entera
const { relative } = require( 'path' ); // Rutas relativas

// Propio
const { adminConnection } = require( '../services/database.js' ); // Base de datos
const { HTTP } = require( '../helpers/constantes.js' ); // Constantes
const { resolveURL, keepFields, toUniversalPath } = require( '../helpers/metodos.js' ); // Metodos generales
const { logRequest } = require( '../helpers/log.js' ); // Registro
const { generateJWT , JWTExpire } = require( '../helpers/jwt' ); // Generador de JSON Web Token
const { deletePfp, pfpURL } = require( '../middleware/files.js' );
const { RUTAMASKFULL } = require( '../helpers/rutas.js' ); // Rutas

// ----------------


// === INICIALIZAR

const elementosPorPagina = 20;

// --------------------------------


// * ================== GET ======================

/**
 * Responde con información básica paginada de usuarios.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getUsuariosBasicos = async( req , res ) => {
    // Construir filtro SQL
    let filter = '';
    let parameters = [];
    let firstQuery = true;
    
    if( req.query.usuario ){
        req.query.usuario = `%${req.query.usuario}%`;
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "usuario LIKE ?";
        parameters.push( req.query.usuario );
    }

    if( req.query.nombre ){
        req.query.nombre = `%${req.query.nombre}%`;
        if( firstQuery === true ){
            filter += 'WHERE ';
            firstQuery = false;
        } else {
            filter += ' AND ';
        }
        filter += "nombre LIKE ?";
        parameters.push( req.query.nombre );
    }

    if( req.query.p ){ // Se espera validado y procesado como entero
        filter += ` ORDER BY usuario LIMIT ?, ${elementosPorPagina}`;
        parameters.push( req.query.p * elementosPorPagina );
    } else {
        filter += ` ORDER BY usuario LIMIT 0, ${elementosPorPagina}`;
    }

    // Query
    adminConnection.query(
`SELECT id, usuario, nombre, imagen, privado FROM usuarios ${filter}` ,
parameters ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getUsuariosBasicos' , HTTP.error_server.internal , 'Error al obtener los usuarios' );
            } else {
                // Resolver URLs de fotos de perfil
                for( let i = 0 ; i < result.length ; i++ ){
                    if( result[ i ].imagen ){
                        result[ i ].imagen = resolveURL( result[ i ].imagen , `${RUTAMASKFULL}/assets/img/pfp/` , -4 );
                    }
                }

                res.status( HTTP.success.ok ).json( {
                    usuarios: result,
                    paginado: {
                        actual: ( req.query.p ) ? req.query.p : 0
                    }
                } );
                logRequest( req , 'getUsuariosBasicos', HTTP.success.ok );
            }
        }
    );
}

/**
 * Responde con información detallada de un usuario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getUsuario = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`SELECT id, usuario, nombre, bio, sexo,
fecha_nac, privado, premium, fecha_reg,
ultimo_acceso, imagen,
(seguidor IS NOT NULL) AS is_siguiendo,
(SELECT COUNT(*) FROM sigue_a WHERE seguido = ?) AS n_seguidores

FROM usuarios
LEFT JOIN sigue_a
ON id = seguido AND seguidor = ?
WHERE id = ?` , [
    idObjetivo,
    idSolicitante,
    idObjetivo
] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getUsuario' , HTTP.error_server.internal , 'Error al obtener el usuario' );
            } else {
                // Si no ha habido coincidencias se indica
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'getUsuario' , HTTP.error_client.not_found );
                    return;
                }

                // Resolver URLs de fotos de perfil
                if( result[ 0 ].imagen ){
                    result[ 0 ].imagen = resolveURL( result[ 0 ].imagen , `${RUTAMASKFULL}/assets/img/pfp/` , -4 );
                }
                
                // Si el usuario es privado y el solicitante no tiene permisos sólo se devuelve lo básico
                if( result[ 0 ].privado && 
                    ( ( idSolicitante !== idObjetivo ) &&
                      ( req.user.isAdmin !== true ) ) ){
                    result[ 0 ] = keepFields( result[ 0 ] , [ 'id' , 'usuario' , 'nombre' , 'imagen' , 'privado' ] );
                    res.status( HTTP.success.ok ).json( result[ 0 ] );
                    logRequest( req , 'getUsuario' , HTTP.success.ok , 'Devuelto básico' );
                    return;
                }

                res.status( HTTP.success.ok ).json( result[ 0 ] );
                logRequest( req , 'getUsuario' , HTTP.success.ok );
            }
        }
    );
}

/**
 * Responde con información detallada de un usuario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getUsuarioBasico = async( req , res ) => {
    // Distingue los identificadores
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
        'SELECT id, usuario, nombre, imagen, privado FROM usuarios WHERE id = ?',
        [ idObjetivo ],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getUsuarioBasico' , HTTP.error_server.internal , 'Error al obtener el usuario' );
            } else {
                // Si no ha habido coincidencias se termina
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'getUsuarioBasico', HTTP.error_client.not_found );
                    return;
                }

                // Resolver URLs de fotos de perfil
                if( result[ 0 ].imagen ){
                    result[ 0 ].imagen = resolveURL( result[ 0 ].imagen , `${RUTAMASKFULL}/assets/img/pfp/` , -4 );
                }

                res.status( HTTP.success.ok ).json( result[ 0 ] );
                logRequest( req , 'getUsuarioBasico', HTTP.success.ok );
            }
        }
    );
}

/**
 * Obtiene el feed paginado del usuario.
 * 
 * Se entiende por feed las publicaciones de los usuarios que sigue ordenadas por fecha.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getFeed = async( req , res ) => {
    // Variables
    const parameters = [];

    // Distingue los identificadores
    const idObjetivo = req.params.id;
    parameters.push( idObjetivo );

    // Paginación
    let pagFilter = '';
    if( req.query.p ){ // Se espera validado y procesado como entero
        pagFilter += `LIMIT ?, ${elementosPorPagina}`;
        parameters.push( req.query.p * elementosPorPagina );
    } else {
        pagFilter += `LIMIT 0, ${elementosPorPagina}`;
    }

    // Query
    adminConnection.query(
`SELECT * FROM publicaciones AS p
INNER JOIN sigue_a AS s ON s.seguido = p.autor
WHERE s.seguidor = ?
ORDER BY fecha DESC
${pagFilter}`, parameters,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getFeed' , HTTP.error_server.internal , 'Error al obtener los recursos' );
            } else {
                res.status( HTTP.success.ok ).json( result );
                logRequest( req , 'getFeed' , HTTP.success.ok );
            }
        }
    );
}

/**
 * Obtiene las valoraciones de un usuario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getValoraciones = async( req , res ) => {
    // Distingue los identificadores
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`SELECT v.acude, v.valoracion, v.observaciones FROM valoraciones AS v
INNER JOIN usuarios AS u ON v.valorado = u.id
WHERE valorado = ?`, [
    idObjetivo
],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getValoraciones' , HTTP.error_server.internal , 'Error al obtener los recursos' );
            } else {
                res.status( HTTP.success.ok ).json( result );
                logRequest( req , 'getValoraciones' , HTTP.success.ok );
            }
        }
    );
}

/**
 * Obtiene la información básica de los usuarios que siguen el usuario objetivo.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getSeguidores = async( req , res ) => {
    // Distingue los identificadores
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`SELECT u.id, u.usuario, u.nombre, u.imagen FROM sigue_a AS s
INNER JOIN usuarios AS u ON u.id = s.seguidor
WHERE s.seguido = ?`, [
    idObjetivo
],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getSeguidores' , HTTP.error_server.internal , 'Error al obtener los recursos' );
            } else {
                res.status( HTTP.success.ok ).json( result );
                logRequest( req , 'getSeguidores' , HTTP.success.ok );
            }
        }
    );
}

/**
 * Obtiene la información básica de los usuarios a los que sigue el usuario objetivo.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getSeguidos = async( req , res ) => {
    // Distingue los identificadores
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`SELECT u.id, u.usuario, u.nombre, u.imagen FROM sigue_a AS s
INNER JOIN usuarios AS u ON u.id = s.seguido
WHERE s.seguidor = ?`, [
    idObjetivo
],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getSeguidos' , HTTP.error_server.internal , 'Error al obtener los recursos' );
            } else {
                res.status( HTTP.success.ok ).json( result );
                logRequest( req , 'getSeguidos' , HTTP.success.ok );
            }
        }
    );
}

/**
 * Obtiene la información básica de los usuarios a los que sigue el usuario objetivo.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getClubes = async( req , res ) => {
    // Distingue los identificadores
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`SELECT c.id, c.nombre, c.imagen, c.privado,
(SELECT COUNT(*) FROM miembro_de WHERE club = id) AS n_miembros
FROM clubes AS c
INNER JOIN miembro_de AS m ON c.id = m.club
WHERE m.usuario = ?`, [
    idObjetivo
],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getClubes' , HTTP.error_server.internal , 'Error al obtener los recursos' );
            } else {
                res.status( HTTP.success.ok ).json( result );
                logRequest( req , 'getClubes' , HTTP.success.ok );
            }
        }
    );
}

/**
 * Obtiene las salidas en las que el usuario ha participado.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getSalidas = async( req , res ) => {
    // Distingue los identificadores
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`SELECT s.* FROM salidas AS s
INNER JOIN participa_en AS p ON s.id = p.salida
WHERE p.usuario = ?
ORDER BY fecha_inicio DESC`, [
    idObjetivo
],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getSalidas' , HTTP.error_server.internal , 'Error al obtener los recursos' );
            } else {
                res.status( HTTP.success.ok ).json( result );
                logRequest( req , 'getSalidas' , HTTP.success.ok );
            }
        }
    );
}

/**
 * Obtiene las reseñas de itinerarios del usuario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getResenas = async( req , res ) => {
    // Distingue los identificadores
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`SELECT * FROM resenas
WHERE usuario = ?
ORDER BY fecha DESC`, [
    idObjetivo
],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getResenas' , HTTP.error_server.internal , 'Error al obtener los recursos' );
            } else {
                res.status( HTTP.success.ok ).json( result );
                logRequest( req , 'getResenas' , HTTP.success.ok );
            }
        }
    );
}

/**
 * Obtiene los distintivos que el usuario ha recibido.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getDistintivos = async( req , res ) => {
    // Distingue los identificadores
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`SELECT d.* FROM distintivos AS d
INNER JOIN recibe_distintivo AS r ON d.id = r.distintivo
WHERE r.usuario = ?`, [
    idObjetivo
],
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getDistintivos' , HTTP.error_server.internal , 'Error al obtener los recursos' );
            } else {
                // Resolver URLs de imágenes de distintivos
                for( let i = 0 ; i < result.length ; i++ ){
                    if( result[ i ].imagen ){
                        result[ i ].imagen = resolveURL( result[ i ].imagen , `${RUTAMASKFULL}/assets/img/distintivo/` , -4 );
                    }
                }

                res.status( HTTP.success.ok ).json( result );
                logRequest( req , 'getDistintivos' , HTTP.success.ok );
            }
        }
    );
}





// -----------------------------------------------


// * ================== POST =====================

/**
 * Crea un nuevo usuario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const createUsuario = async( req , res ) => {
    // Obtiene la información del cuerpo de la petición
    let { usuario, email,
        contrasena,
        nombre, bio,
        sexo, fecha_nac, privado, premium,
        fecha_reg,
        ultimo_acceso,
        ipv4, imagen } = req.body;

    // Cifra la contraseña con un salt aleatorio
    contrasena = bcrypt.hashSync( contrasena , bcrypt.genSaltSync() );

    // Procesa el resto de la información
    if( !usuario ) usuario = email.slice( 0 , 15 );
    if( !nombre ) nombre = email.slice( 0 , 40 );
    bio = '¡Hola! Soy un usuario nuevo en HikIn';
    if( !sexo ) sexo = 0;
    fecha_nac = null;
    privado = 0;
    premium = 0;
    fecha_reg = new Date();
    ultimo_acceso = fecha_reg;
    ipv4 = toLong( req.ip || req.connection.remoteAddress );
    imagen = null;

    // Intenta insertar el nuevo usuario con su información
    adminConnection.query(
`INSERT INTO usuarios(
  usuario, email,
  contrasena,
  nombre, bio,
  sexo, fecha_nac, privado, premium,
  fecha_reg,
  ultimo_acceso,
  ipv4, imagen
) VALUES (
  ?, ?,
  ?,
  ?, ?,
  ?, ?, ?, ?,
  ?,
  ?,
  ? , ?
)` , [
    usuario, email,
    contrasena,
    nombre, bio,
    sexo, fecha_nac, privado, premium,
    fecha_reg,
    ultimo_acceso,
    ipv4, imagen
] ,
        ( err , result ) => {
            if( err ){
                if( err.errno === 1062 ){
                    res.status( HTTP.error_client.bad_request ).json( { msg: 'Ya existe una cuenta con ese email' } );
                    logRequest( req , 'createUsuario' , HTTP.error_client.bad_request , 'Ya existe una cuenta con ese email' );
                }
                else{
                    console.error( err );
                    res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                    logRequest( req , 'createUsuario' , HTTP.error_server.internal , 'Error al insertar el usuario' );
                }
            } else {
                // Genera un token
                generateJWT( result.insertId , false ).then( ( token ) => {
                    // Construye un objeto usuario que devolver
                    const insertedObject = {};

                    insertedObject.id = result.insertId;
                    insertedObject.usuario = usuario;
                    insertedObject.email = email;
                    insertedObject.nombre = nombre;
                    insertedObject.bio = bio;
                    insertedObject.sexo = sexo;
                    insertedObject.fecha_nac = fecha_nac;
                    insertedObject.privado = privado;
                    insertedObject.premium = premium;
                    insertedObject.fecha_reg = fecha_reg;
                    insertedObject.ultimo_acceso = ultimo_acceso;
                    insertedObject.imagen = imagen;

                    // Responde con el objeto usuario, el token y su expiración
                    res.status( HTTP.success.ok ).json( {
                        usuario: insertedObject,
                        token: {
                            jwt: token,
                            expires: JWTExpire
                        }
                    } );
                    logRequest( req , 'createUsuario' , HTTP.success.ok );
                } ).catch( ( err ) => {
                    console.error( err );
                    res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                    logRequest( req , 'createUsuario' , HTTP.error_server.internal , 'Error al generar el JWT' );
                } );
            }
        }
    );
}

/**
 * Sigue a un usuario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const seguirUsuario = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`INSERT INTO sigue_a(
  seguidor, seguido
) VALUES (
  ?, ?
)` , [
    idSolicitante,
    idObjetivo
] ,
        ( err , result ) => {
            if( err && err.errno !== 1062 ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'seguirUsuario' , HTTP.error_server.internal , 'Error al insertar el recurso' );
            } else {
                res.status( HTTP.success.no_content ).json();
                logRequest( req , 'seguirUsuario' , HTTP.success.no_content );
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
        'SELECT id FROM usuarios WHERE id = ?' ,
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
                if( ( result[ 0 ].id !== idSolicitante ) &&
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
        'SELECT imagen FROM usuarios WHERE id = ?' ,
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
                    if( result[ 0 ].imagen !== null ) deletePfp( result[ 0 ].imagen );
                
                    // Construye la URL de la imagen.
                    let imageUniversalURL = toUniversalPath( relative( '.' , req.file.path ) );
                
                    // Se asigna el nuevo archivo
                    adminConnection.query(
                        'UPDATE usuarios SET imagen = ? WHERE id = ?' ,
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
                                    imageUniversalURL = resolveURL( imageUniversalURL, `${RUTAMASKFULL}${pfpURL}`, -4 );

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
 * Actualiza un usuario usuario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const updateUsuario = async( req , res ) => {
    // Distingue los identificadores
    const idObjetivo = parseInt( req.params.id );

    // Obtiene la información del cuerpo de la petición
    let { usuario, email, nombre, bio, sexo, fecha_nac, privado } = req.body;

    // Construct SQL filter
    let filter = '';
    let parameters = [];
    let firstQuery = true;

    if( usuario ){
        if( firstQuery === true ){
            filter += " SET ";
            firstQuery = false;
        } else {
            filter += ", ";
        }
        filter += "usuario = ?";
        parameters.push( usuario );
    }

    if( email ){
        if( firstQuery === true ){
            filter += " SET ";
            firstQuery = false;
        } else {
            filter += ", ";
        }
        filter += "email = ?";
        parameters.push( email );
    }

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

    if( bio ){
        if( firstQuery === true ){
            filter += " SET ";
            firstQuery = false;
        } else {
            filter += ", ";
        }
        filter += "bio = ?";
        parameters.push( bio );
    }

    if( sexo ){
        if( firstQuery === true ){
            filter += " SET ";
            firstQuery = false;
        } else {
            filter += ", ";
        }
        filter += "sexo = ?";
        parameters.push( sexo );
    }

    if( fecha_nac ){
        if( firstQuery === true ){
            filter += " SET ";
            firstQuery = false;
        } else {
            filter += ", ";
        }
        filter += "fecha_nac = ?";
        parameters.push( fecha_nac );
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
        // Intenta insertar el nuevo usuario con su información
        adminConnection.query(
            `UPDATE usuarios ${filter} WHERE id = ?` , parameters ,
            ( err , result ) => {
                if( err ){
                    if( err.errno === 1062 ){
                        res.status( HTTP.error_client.bad_request ).json( { msg: 'Ya existe una cuenta con ese email' } );
                        logRequest( req , 'updateUsuario' , HTTP.error_client.bad_request , 'Ya existe una cuenta con ese email' );
                    }
                    else{
                        console.error( err );
                        res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                        logRequest( req , 'updateUsuario' , HTTP.error_server.internal , 'Error al actualizar el usuario' );
                    }
                } else {
                    if( result.affectedRows === 0 ){
                        res.status( HTTP.error_client.not_found ).send();
                        logRequest( req , 'updateUsuario' , HTTP.error_client.not_found );
                    } else {
                        res.status( HTTP.success.no_content ).send();
                        logRequest( req , 'updateUsuario' , HTTP.success.no_content );
                    }
                }
            }
        );
    } else {
        res.status( HTTP.success.no_content ).send();
        logRequest( req , 'updateClub', HTTP.success.no_content );
    }
}

// -----------------------------------------------


// * ================= DELETE ====================

/**
 * Actualiza un usuario usuario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const deleteUsuario = async( req , res ) => {
    // Distingue los identificadores
    const idObjetivo = req.params.id;

    // Intenta eliminar el usuario
    adminConnection.query(
        'DELETE FROM usuarios WHERE id = ?' ,
        [ idObjetivo ] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'deleteUsuario' , HTTP.error_server.internal , 'Error al eliminar el usuario' );
            } else {
                if( result.affectedRows === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'deleteUsuario' , HTTP.error_client.not_found );
                } else {
                    res.status( HTTP.success.no_content ).send();
                    logRequest( req , 'deleteUsuario' , HTTP.success.no_content );
                }
            }
        }
    );
}

/**
 * Deja de seguir a un usuario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const deseguirUsuario = async( req , res ) => {
    // Distingue los identificadores
    const idSolicitante = req.user.id;
    const idObjetivo = req.params.id;

    // Query
    adminConnection.query(
`DELETE FROM sigue_a
WHERE seguidor = ? AND seguido = ?` , [
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


/**
 * Elimina la foto de perfil de un usuario.
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
        'SELECT id, imagen FROM usuarios WHERE id = ?' ,
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
                if( ( result[ 0 ].id !== idSolicitante ) &&
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

                deletePfp( result[ 0 ].imagen );

                adminConnection.query(
                    'UPDATE usuarios SET imagen = NULL WHERE id = ?' ,
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
module.exports = { getUsuariosBasicos, getUsuario, getUsuarioBasico,
    createUsuario, updateUsuario, deleteUsuario,
    getFeed, getValoraciones,
    getSeguidores, getSeguidos, seguirUsuario, deseguirUsuario,
    getClubes, getSalidas, getResenas, getDistintivos,
    cambiarImagen, cambiarImagenResponse,
    borrarImagen };