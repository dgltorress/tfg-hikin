/**
 * CONTROLLER: Usuarios
 */

// === IMPORTAR ===

// Librerias de terceros
const bcrypt = require( 'bcrypt' ); // BcryptJS
const { toLong } = require( 'ip' ); // Pasar IPs a version entera

// Propio
const { adminConnection } = require( '../services/database.js' ); // Base de datos
const { COLOR , HTTP } = require( '../helpers/constantes.js' ); // Constantes
const { pullFields, keepFields, filterQueries, resolveURL } = require( '../helpers/metodos.js' ); // Metodos generales
const { logRequest } = require( '../helpers/log.js' ); // Registro
const { generateJWT , JWTExpire } = require( '../helpers/jwt' ); // Generador de JSON Web Token
const { RUTAMASKFULL } = require( '../helpers/rutas.js' ); // Rutas

// ----------------


// === INICIALIZAR

const usuariosPorPagina = 4;

// --------------------------------


// * ================== GET ======================

/**
 * Responde con información básica de usuarios.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const getUsuarios = async( req , res ) => {
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
        filter += ` ORDER BY usuario LIMIT ?, ${usuariosPorPagina}`;
        parameters.push( req.query.p * usuariosPorPagina );
    } else {
        filter += ` ORDER BY usuario LIMIT 0, ${usuariosPorPagina}`;
    }

    // Query
    adminConnection.query(
`SELECT id, usuario, nombre, imagen FROM usuarios ${filter}` ,
parameters ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getUsuarios' , HTTP.error_server.internal , 'Error al obtener los usuarios' );
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
                logRequest( req , 'getUsuarios', HTTP.success.ok );
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
                // Si no ha habido coincidencias se termina
                if( result.length === 0 ){
                    res.status( HTTP.error_client.not_found ).send();
                    logRequest( req , 'getUsuario', HTTP.error_client.not_found );
                    return;
                }

                // Resolver URLs de fotos de perfil
                if( result[ 0 ].imagen ){
                    result[ 0 ].imagen = resolveURL( result[ 0 ].imagen , `${RUTAMASKFULL}/assets/img/pfp/` , -4 );
                }
                
                // Si el usuario es privado y el solicitante no tiene permisos sólo se devuelve lo básico
                if( result[ 0 ].privado && 
                    ( ( idSolicitante !== idObjetivo ) || // Es propietario o
                      ( req.user.isAdmin === true ) ) ){
                    

                    return;
                }

                res.status( HTTP.success.ok ).json( result[ 0 ] );
                logRequest( req , 'getUsuario', HTTP.success.ok );
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
const createUsuario = ( req , res ) => {
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
                if( err.sqlState === '23000' ){
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

// -----------------------------------------------


// * ================= PATCH =====================

/**
 * Actualiza un usuario usuario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
const updateUsuario = ( req , res ) => {
    // Distingue los identificadores
    const idObjetivo = req.params.id;

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

    // Intenta insertar el nuevo usuario con su información
    adminConnection.query(
`UPDATE usuarios ${filter} WHERE id = ?` , parameters ,
        ( err , result ) => {
            if( err ){
                if( err.sqlState === '23000' ){
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
}

// -----------------------------------------------


// * ================= DELETE ====================

/**
 * Actualiza un usuario usuario.
 * 
 * @param {*} req Petición del cliente.
 * @param {*} res Respuesta del servidor.
 */
 const deleteUsuario = ( req , res ) => {
    // Distingue los identificadores
    const idObjetivo = req.params.id;

    // Intenta insertar el nuevo usuario con su información
    adminConnection.query(
        'DELETE FROM usuarios WHERE id = ?' ,
        [ idObjetivo ] ,
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( { msg: 'Ha habido un error' } );
                logRequest( req , 'updateUsuario' , HTTP.error_server.internal , 'Error al actualizar el usuario' );
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
}

// -----------------------------------------------







// Marcar los metodos para exportar
module.exports = { getUsuarios , getUsuario, createUsuario, updateUsuario, deleteUsuario };