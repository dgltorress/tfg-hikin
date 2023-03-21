/**
 * CONTROLLER: Usuarios
 */

// === IMPORTAR ===

// Librerias de terceros
const bcrypt = require( 'bcrypt' ); // BcryptJS
const { toLong } = require( 'ip' ); // Pasar IPs a version entera

// Propio
const { adminConnection } = require( '../services/database.js' ); // Base de datos
const { COLOR , HTTP , textRegExEsp } = require( '../helpers/constantes.js' ); // Constantes
const { pullFields, resolveURL } = require( '../helpers/metodos.js' ); // Metodos generales
const { logRequest } = require( '../helpers/log.js' ); // Registro
const { generateJWT , JWTExpire } = require( '../helpers/jwt' ); // Generador de JSON Web Token
const { RUTAMASKFULL } = require( '../helpers/rutas.js' ); // Rutas

// ----------------



// * ================== GET ======================

const getUsuarios = async( req , res ) => {
    adminConnection.query(
        'SELECT * FROM usuarios' , [] , // PAGINAR CONSULTA + FILTROS
        ( err , result ) => {
            if( err ){
                console.error( err );
                res.status( HTTP.error_server.internal ).json( {
                    msg: 'Ha habido un error'
                } );
                logRequest( req , 'getUsuarios' , HTTP.error_server.internal , 'Error al obtener los usuarios' );
            } else {
                // Elimina campos que no conviene enviar
                pullFields( result[ 0 ] , [ 'contrasena' , 'ipv4' ] );

                // Resolver URLs de fotos de perfil
                for( let i = 0 ; i < result.length ; i++ ){
                    if( result[ i ].imagen ){
                        result[ i ].imagen = resolveURL( result[ i ].imagen , RUTAMASKFULL , 'assets/img/pfp' , -4 );
                    }
                }

                res.status( HTTP.success.ok ).json( {
                    usuarios: result,
                    paginado: {
                        actual: 1,
                        total: 1
                    }
                } );
                logRequest( req , 'getUsuarios', HTTP.success.ok );
            }
        }
    );
}

// -----------------------------------------------


// * ================== POST =====================

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
                // Convierte el id de BigInt a Number (JWT no admite bigInt)
                result.insertId = Number( result.insertId );

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
                    logRequest( req , 'login' , HTTP.success.ok );
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



// * ================== PUT ======================



// -----------------------------------------------


// * ================= PATCH =====================



// -----------------------------------------------


// * ================= DELETE ====================



// -----------------------------------------------







// Marcar los metodos para exportar
module.exports = { getUsuarios , createUsuario };