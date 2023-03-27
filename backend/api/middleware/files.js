/**
 * SUBE ARCHIVOS
 */

// === IMPORTAR ===

// Librerias
const fs                          = require( 'fs' );     // FileSystem para operar con archivos
const { resolve , extname , sep } = require( 'path' );   // Transformar rutas de archivo relativas
const multer                      = require( 'multer' ); // Procesar multipart/form-data
const bytes                       = require( 'bytes' );  // Conversor de bytes a otras unidades

// Propio
const { logRequest }   = require( '../helpers/log.js' ); // Registro
const { HTTP , COLOR } = require( '../helpers/constantes.js' );      // Constantes complejas

// ----------------


// ================= INICIALIZAR =================

// Parsea las variables de entorno y crea otras constantes.
// Tamano maximo por defecto.
const maxSizeDefault   = '2MB';
const fieldNameImageDefault = 'image';

// === IMÁGENES DE PUBLICACIÓN

// Ruta completa a la carpeta donde se guardan las imágenes de publicación.
const postFilePathEnv = process.env.POST_RELATIVE_PATH;
const postFilePath = ( postFilePathEnv &&
    ( postFilePathEnv.length > 0 ) )
    ? resolve( postFilePathEnv ) : '' ;

// URL parcial en la que buscar imágenes de publicación.
const postURLEnv = process.env.POST_URL;
const postURL = ( postURLEnv &&
    ( postURLEnv.length > 0 ) )
    ? postURLEnv : '' ;

// Nombre del campo de formulario donde vienen las imágenes de publicación.
const postFieldNameEnv = process.env.POST_FORM_FIELD_NAME;
const postFieldName = ( postFieldNameEnv &&
    ( postFieldNameEnv.length > 0 ) )
    ? postFieldNameEnv : fieldNameImageDefault ;

// Tamaño máximo de las imágenes de publicación.
const postMaxSizeEnv = process.env.POST_MAX_SIZE;
let postMaxSize = ( postMaxSizeEnv &&
    postMaxSizeEnv.length > 0 )
    ? bytes( postMaxSizeEnv ) : maxSizeDefault;
if( postMaxSize === null ) postMaxSize = bytes( maxSizeDefault );

// Si está activado el guardado de imágenes (hay ruta de guardado y campo de imágenes de publicación).
const isPostSavingEnabled = ( ( postFilePath !== '' ) && ( postFieldName !== '' ) );


// Opciones de guardado de multer (imágenes de publicación).
const postStorageOptions = {
    // DESTINO
    destination: ( req , file , cb ) => { // Prepara el destino
        const directoryPath = buildDynamicDateDirectoryPath( postFilePath );

        if( makeDirectoryRecursively( directoryPath ) === true ){
            cb( null , directoryPath );
        }
        else{
            cb( null , null );
        }
    },
    // NOMBRE DE LOS FICHEROS
    filename: ( req , file , cb ) => {
        cb( null , generateUniqueFilename( file ) );
    }
};
const postStorage = multer.diskStorage( postStorageOptions ); // Guardar imágenes en la ruta indicada.

// Opciones para la llamada a multer (imágenes de publicación).
const postUploadOptions = {
    storage: postStorage, // Objeto storage.
    fileFilter: ( req , file , cb ) => { // Solo se aceptan imagenes .jpg, .jpeg y .png.
        const extension = extname( file.originalname ).toLowerCase();
        const mimetyp   = file.mimetype;

        // Se rechaza y se anade un mensaje de error si la extension no es soportada.
        if ( extension !== '.jpg'  && mimetyp !== 'image/jpg'  &&
             extension !== '.jpeg' && mimetyp !== 'image/jpeg' &&
             extension !== '.png'  && mimetyp !== 'image/png' ){
            req.uploadErr = {
                status: HTTP.error_client.bad_request,
                msg: 'Solo se aceptan imagenes  .jpg, .jpeg y .png'
            };

            return cb( new multer.MulterError( 'Solo se aceptan imagenes  .jpg, .jpeg y .png' ) );
        }

        cb( null , true );
    },
    limits: { // Se pone un limite al tamano de imagen, definido en .env.
        fileSize: postMaxSize
    },
    preservePath: false // Se guarda solo el nombre base del archivo.
};
const postUpload = isPostSavingEnabled ? multer( postUploadOptions ).single( postFieldName ) : '' ; // Subir imágenes a la ruta indicada.


// ------------------------


// === FOTOS DE PERFIL

// Ruta completa a la carpeta donde se guardan las fotos de perfil.
const pfpFilePathEnv = process.env.PFP_RELATIVE_PATH;
const pfpFilePath = ( pfpFilePathEnv &&
    ( pfpFilePathEnv.length > 0 ) )
    ? resolve( pfpFilePathEnv ) : '' ;

// URL parcial en la que buscar fotos de perfil.
const pfpURLEnv = process.env.PFP_URL;
const pfpURL = ( pfpURLEnv &&
    ( pfpURLEnv.length > 0 ) )
    ? pfpURLEnv : '' ;

// Nombre del campo de formulario donde vienen las fotos de perfil.
const pfpFieldNameEnv = process.env.PFP_FORM_FIELD_NAME;
const pfpFieldName = ( pfpFieldNameEnv &&
    ( pfpFieldNameEnv.length > 0 ) )
    ? pfpFieldNameEnv : fieldNameImageDefault ;

// Tamaño máximo de las fotos de perfil.
const pfpMaxSizeEnv = process.env.PFP_MAX_SIZE;
let pfpMaxSize = ( pfpMaxSizeEnv &&
    pfpMaxSizeEnv.length > 0 )
    ? bytes( pfpMaxSizeEnv ) : maxSizeDefault;
if( pfpMaxSize === null ) pfpMaxSize = bytes( maxSizeDefault );

// Si está activado el guardado de imágenes (hay ruta de guardado y campo de fotos de perfil).
const isPfpSavingEnabled = ( pfpFilePath !== '' );



// Opciones de guardado de multer (foto de perfil).
const pfpStorageOptions = {
    // DESTINO
    destination: ( req , file , cb ) => { // Prepara el destino
        const directoryPath = buildDynamicDateDirectoryPath( pfpFilePath );
    
        if( makeDirectoryRecursively( directoryPath ) === true ){
            cb( null , directoryPath );
        }
        else{
            cb( null , null );
        }
    },
    // NOMBRE DE LOS FICHEROS
    filename: ( req , file , cb ) => {
        cb( null , generateUniqueFilename( file ) );
    }
};
const pfpStorage = multer.diskStorage( pfpStorageOptions ); // Guardar imágenes en la ruta indicada.

// Opciones para la llamada a multer (foto de perfil).
const pfpUploadOptions = {
    storage: pfpStorage, // Objeto storage.
    fileFilter: ( req , file , cb ) => { // Solo se aceptan imagenes .jpg, .jpeg y .png.
        const extension = extname( file.originalname ).toLowerCase();
        const mimetyp   = file.mimetype;

        // Se rechaza y se anade un mensaje de error si la extension no es soportada.
        if ( extension !== '.jpg'  && mimetyp !== 'image/jpg'  &&
             extension !== '.jpeg' && mimetyp !== 'image/jpeg' &&
             extension !== '.png'  && mimetyp !== 'image/png'  ){

            req.uploadErr = {
                status: HTTP.error_client.bad_request,
                msg: 'Solo se aceptan imagenes .jpg, .jpeg y .png'
            };

            return cb( new multer.MulterError( 'Solo se aceptan imagenes .jpg, .jpeg y .png' ) );
        }

        cb( null , true );
    },
    limits: { // Se pone un limite al tamano de imagen, definido en .env.
        fileSize: pfpMaxSize
    },
    preservePath: false // Se guarda solo el nombre base del archivo.
};
const pfpUpload = isPfpSavingEnabled ? multer( pfpUploadOptions ).single( pfpFieldName ) : '' ; // Subir imágenes a la ruta indicada.

// ------------------

// === IMÁGENES DE CLUB

// Ruta completa a la carpeta donde se guardan las imágenes de club.
const clubFilePathEnv = process.env.CLUB_RELATIVE_PATH;
const clubFilePath = ( clubFilePathEnv &&
    ( clubFilePathEnv.length > 0 ) )
    ? resolve( clubFilePathEnv ) : '' ;

// URL parcial en la que buscar imágenes de club.
const clubURLEnv = process.env.CLUB_URL;
const clubURL = ( clubURLEnv &&
    ( clubURLEnv.length > 0 ) )
    ? clubURLEnv : '' ;

// Nombre del campo de formulario donde vienen las imágenes de club.
const clubFieldNameEnv = process.env.CLUB_FORM_FIELD_NAME;
const clubFieldName = ( clubFieldNameEnv &&
    ( clubFieldNameEnv.length > 0 ) )
    ? clubFieldNameEnv : fieldNameImageDefault ;

// Tamaño máximo de las imágenes de club.
const clubMaxSizeEnv = process.env.CLUB_MAX_SIZE;
let clubMaxSize = ( clubMaxSizeEnv &&
    clubMaxSizeEnv.length > 0 )
    ? bytes( clubMaxSizeEnv ) : maxSizeDefault;
if( clubMaxSize === null ) clubMaxSize = bytes( maxSizeDefault );

// Si está activado el guardado de imágenes (hay ruta de guardado y campo de imágenes de club).
const isClubSavingEnabled = ( clubFilePath !== '' );



// Opciones de guardado de multer (imágenes de club).
const clubStorageOptions = {
    // DESTINO
    destination: ( req , file , cb ) => { // Prepara el destino
        const directoryPath = buildDynamicDateDirectoryPath( clubFilePath );
    
        if( makeDirectoryRecursively( directoryPath ) === true ){
            cb( null , directoryPath );
        }
        else{
            cb( null , null );
        }
    },
    // NOMBRE DE LOS FICHEROS
    filename: ( req , file , cb ) => {
        cb( null , generateUniqueFilename( file ) );
    }
};
const clubStorage = multer.diskStorage( clubStorageOptions ); // Guardar imágenes en la ruta indicada.

// Opciones para la llamada a multer (imágenes de club).
const clubUploadOptions = {
    storage: clubStorage, // Objeto storage.
    fileFilter: ( req , file , cb ) => { // Solo se aceptan imagenes .jpg, .jpeg y .png.
        const extension = extname( file.originalname ).toLowerCase();
        const mimetyp   = file.mimetype;

        // Se rechaza y se anade un mensaje de error si la extension no es soportada.
        if ( extension !== '.jpg'  && mimetyp !== 'image/jpg'  &&
             extension !== '.jpeg' && mimetyp !== 'image/jpeg' &&
             extension !== '.png'  && mimetyp !== 'image/png'  ){

            req.uploadErr = {
                status: HTTP.error_client.bad_request,
                msg: 'Solo se aceptan imagenes .jpg, .jpeg y .png'
            };

            return cb( new multer.MulterError( 'Solo se aceptan imagenes .jpg, .jpeg y .png' ) );
        }

        cb( null , true );
    },
    limits: { // Se pone un limite al tamano de imagen, definido en .env.
        fileSize: clubMaxSize
    },
    preservePath: false // Se guarda solo el nombre base del archivo.
};
const clubUpload = isClubSavingEnabled ? multer( clubUploadOptions ).single( clubFieldName ) : '' ; // Subir imágenes a la ruta indicada.


// ------------------


// -----------------------------------------------


// =============== NOTIFICAR ===============

if( isPostSavingEnabled ){
    console.log( `
${COLOR.texto.magenta}----------------------------------

Guardado de ${COLOR.texto.cian}imágenes de publicaciones${COLOR.texto.magenta} ACTIVADO (desde ${COLOR.texto.cian}.env${COLOR.texto.magenta}).
Ruta de la carpeta de imágenes de publicaciones: ${COLOR.texto.cian}${postFilePath}${COLOR.texto.magenta}
Nombre del campo de formulario: ${COLOR.texto.cian}"${postFieldName}"${COLOR.texto.magenta}
Tamaño máximo de imagen: ${COLOR.texto.cian}${postMaxSize} bytes${COLOR.texto.magenta} (${COLOR.texto.cian}${bytes( postMaxSize )}${COLOR.texto.magenta})

----------------------------------${COLOR.reset}
` );
}

if( isPfpSavingEnabled ){
    console.log( `
${COLOR.texto.magenta}----------------------------------

Guardado de ${COLOR.texto.cian}imagenes de perfil${COLOR.texto.magenta} ACTIVADO (desde ${COLOR.texto.cian}.env${COLOR.texto.magenta}).
Ruta de la carpeta de imagenes de perfil: ${COLOR.texto.cian}${pfpFilePath}${COLOR.texto.magenta}
Nombre del campo de formulario: ${COLOR.texto.cian}"${pfpFieldName}"${COLOR.texto.magenta}
Tamaño máximo de imagen: ${COLOR.texto.cian}${pfpMaxSize} bytes${COLOR.texto.magenta} (${COLOR.texto.cian}${bytes( pfpMaxSize )}${COLOR.texto.magenta})

----------------------------------${COLOR.reset}
` );
}

if( isClubSavingEnabled ){
    console.log( `
${COLOR.texto.magenta}----------------------------------

Guardado de ${COLOR.texto.cian}imágenes de club${COLOR.texto.magenta} ACTIVADO (desde ${COLOR.texto.cian}.env${COLOR.texto.magenta}).
Ruta de la carpeta de imágenes de club: ${COLOR.texto.cian}${clubFilePath}${COLOR.texto.magenta}
Nombre del campo de formulario: ${COLOR.texto.cian}"${clubFieldName}"${COLOR.texto.magenta}
Tamaño máximo de imagen: ${COLOR.texto.cian}${clubMaxSize} bytes${COLOR.texto.magenta} (${COLOR.texto.cian}${bytes( clubMaxSize )}${COLOR.texto.magenta})

----------------------------------${COLOR.reset}
` );
}

// -----------------------------------------


/**
 * Sube una imagen de publicación al sistema.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta del servidor.
 * @param {*} next Siguiente método a ejecutar.
 */
const uploadPostImage = ( req , res , next ) => {
    // El guardado de imágenes de publicación debe estar habilitado.
    if( isPostSavingEnabled ){
        postUpload( req , res , ( err ) => {
            // No debe haber ningún error almacenado hasta este punto.
            if( req.uploadErr ){
                res.status( req.uploadErr.status ).json( { msg: req.uploadErr.msg } );
                logRequest( req , 'uploadPostImage' , req.uploadErr.status , req.uploadErr.msg );
                return;
            }
            // Error de Multer (mensaje ya implementado por la libreria), el culpable es el cliente.
            else if( err instanceof multer.MulterError ){
                req.uploadErr = {
                    status: HTTP.error_client.bad_request,
                    msg: err.message
                };
            }
            // Error desconocido. El servidor asume la culpa.
            else if( err ){
                console.error( err );
                req.uploadErr = {
                    status: HTTP.error_server.internal,
                    msg: 'ha habido un error al subir la imagen de publicación'
                };
            }
            else{
                if( req.file ){
                    console.log( `Imagen de publicación del usuario con UID ${req.uid} subida a "${req.file.path}"` );
                }
                else{
                    console.log( `Imagen de publicación del usuario con UID ${req.uid} vacía. No se ha creado ningún archivo.` );
                }
            }
    
            next();
        } );
    }
    else{
        req.uploadErr = {
            status: HTTP.error_server.service_unavailable,
            msg: 'el guardado de imágenes de publicación no está habilitado en este momento'
        };

        res.status( req.uploadErr.status ).json( { msg: req.uploadErr.msg } );
        logRequest( req , 'uploadPostImage' , req.uploadErr.status , req.uploadErr.msg );
    }

    return;
}

/**
 * Elimina una imagen de publicación del sistema.
 * 
 * @param {string} path Ruta (relativa o absoluta) al fichero a borrar.
 */
const deletePostImage = async( path ) => {
    const fullPath = resolve( path );
    fs.unlink( fullPath , ( err ) => {
        if( err ){
            console.warn( err );
            console.log( `No se ha podido eliminar el fichero "${fullPath}"` );
            return err;
        }
        else console.log( `Fichero "${fullPath}" eliminado` );
    } );

    return null;
}





/**
 * Sube una foto de perfil al sistema.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta del servidor.
 * @param {*} next Siguiente metodo a ejecutar.
 */
const uploadPfp = ( req , res , next ) => {
    // El guardado de fotos de perfil debe estar habilitado.
    if( isPfpSavingEnabled ){
        pfpUpload( req , res , ( err ) => {
            // No debe haber ningun error almacenado hasta este punto.
            if( req.uploadErr ){
                res.status( req.uploadErr.status ).json( { msg: req.uploadErr.msg } );
                logRequest( req , 'uploadPfp' , req.uploadErr.status , req.uploadErr.msg );
                return;
            }
            // Error de Multer (mensaje ya implementado por la librería), el culpable es el cliente.
            else if( err instanceof multer.MulterError ){
                req.uploadErr = {
                    status: HTTP.error_client.bad_request,
                    msg: err.message
                };
            }
            // Error desconocido. El servidor asume la culpa.
            else if( err ){
                console.error( err );
                req.uploadErr = {
                    status: HTTP.error_server.internal,
                    msg: 'ha habido un error al subir la foto de perfil'
                };
            }
            else{
                if( req.file ){
                    console.log( `Foto de perfil del usuario con UID ${req.uid} subida a "${req.file.path}"` );
                }
                else{
                    console.log( `Foto de perfil del usuario con UID ${req.uid} vacía. No se ha creado ningún archivo.` );
                }
            }
    
            next();
        } );
    }
    else{
        req.uploadErr = {
            status: HTTP.error_server.service_unavailable,
            msg: 'el guardado de fotos de perfil no está habilitado en este momento'
        };

        res.status( req.uploadErr.status ).json( { msg: req.uploadErr.msg } );
        logRequest( req , 'uploadPfp' , req.uploadErr.status , req.uploadErr.msg );
    }

    return;
}

/**
 * Elimina una foto de perfil del sistema.
 * 
 * @param {string} path Ruta (relativa o absoluta) al fichero a borrar.
 */
const deletePfp = async( path ) => {
    const fullPath = resolve( path );
    fs.unlink( fullPath , ( err ) => {
        if( err ){
            console.warn( err );
            console.log( `No se ha podido eliminar el fichero "${fullPath}"` );
            return err;
        }
        else console.log( `Fichero "${fullPath}" eliminado` );
    } );

    return null;
}




/**
 * Sube una imagen de club al sistema.
 * 
 * @param {*} req Peticion del cliente.
 * @param {*} res Respuesta del servidor.
 * @param {*} next Siguiente metodo a ejecutar.
 */
 const uploadClubImage = ( req , res , next ) => {
    // El guardado de imágenes de club debe estar habilitado.
    if( isClubSavingEnabled ){
        clubUpload( req , res , ( err ) => {
            // No debe haber ningun error almacenado hasta este punto.
            if( req.uploadErr ){
                res.status( req.uploadErr.status ).json( { msg: req.uploadErr.msg } );
                logRequest( req , 'uploadClubImage' , req.uploadErr.status , req.uploadErr.msg );
                return;
            }
            // Error de Multer (mensaje ya implementado por la librería), el culpable es el cliente.
            else if( err instanceof multer.MulterError ){
                req.uploadErr = {
                    status: HTTP.error_client.bad_request,
                    msg: err.message
                };
            }
            // Error desconocido. El servidor asume la culpa.
            else if( err ){
                console.error( err );
                req.uploadErr = {
                    status: HTTP.error_server.internal,
                    msg: 'ha habido un error al subir la imagen de club'
                };
            }
            else{
                if( req.file ){
                    console.log( `Imagen de club del usuario con UID ${req.uid} subida a "${req.file.path}"` );
                }
                else{
                    console.log( `Imagen de club del usuario con UID ${req.uid} vacía. No se ha creado ningún archivo.` );
                }
            }
    
            next();
        } );
    }
    else{
        req.uploadErr = {
            status: HTTP.error_server.service_unavailable,
            msg: 'el guardado de imágenes de club no está habilitado en este momento'
        };

        res.status( req.uploadErr.status ).json( { msg: req.uploadErr.msg } );
        logRequest( req , 'uploadClubImage' , req.uploadErr.status , req.uploadErr.msg );
    }

    return;
}

/**
 * Elimina una foto de perfil del sistema.
 * 
 * @param {string} path Ruta (relativa o absoluta) al fichero a borrar.
 */
const deleteClubImage = async( path ) => {
    const fullPath = resolve( path );
    fs.unlink( fullPath , ( err ) => {
        if( err ){
            console.warn( err );
            console.log( `No se ha podido eliminar el fichero "${fullPath}"` );
            return err;
        }
        else console.log( `Fichero "${fullPath}" eliminado` );
    } );

    return null;
}





/**
 * Construye una ruta absoluta a un directorio de forma dinamica atendiendo al ano, mes y dia actuales.
 * 
 * @param {string} basePath Ruta base, relativa o absoluta, donde crear las subcarpetas de fecha dinamicamente.
 * @returns Ruta absoluta a un directorio ficticio basado en la fecha actual.
 */
const buildDynamicDateDirectoryPath = ( basePath ) => {
    // Guarda la fecha actual
    const rightNow = new Date();

    // Construye una ruta con subcarpetas dinamicas segun el dia
    // Ej: { ( C:/Users/Yo/Proyectos )/assets/imagenes }{ / }{ 2023 }{ / }{ 2 }{ / }{ 17 }
    return resolve( `${basePath}${sep}${rightNow.getFullYear()}${sep}${rightNow.getMonth()+1}${sep}${rightNow.getDate()}` );
}

/**
 * Crea un directorio **CON** la ruta especificada.
 * 
 * @param {string} directoryPath Ruta del directorio que aun no existe.
 * @param {boolean} doRecursively Si se debe crear subdirectorios recursivamente. Por defecto `true`.
 * @returns `true` si se ha creado correctamente, `false` si ha habido algun error.
 */
const makeDirectoryRecursively = ( directoryPath , doRecursively = true ) => {
    // Crea el directorio
    try{
        fs.mkdirSync( directoryPath , { recursive: doRecursively } );
    } catch( err ){
        console.error( err );
        console.error( `${COLOR.texto.rojo}No se ha podido crear el directorio "${directoryPath}"${COLOR.reset}` );
        return false;
    }

    return true;
}

/**
 * Genera un nombre unico y aleatorio para un archivo.
 * 
 * @param {object} file Informacion del archivo base.
 * @returns Nombre unico para un archivo
 */
const generateUniqueFilename = ( file ) => {
    // Genera los elementos del nombre
    const uniqueSuffix = `${Date.now()}-${Math.round( Math.random() * 1E9 )}`; // Sufijo unico con la fecha y un valor aleatorio.
    let extension = extname( file.originalname ).toLowerCase();                // Extension extraida del nombre del archivo original.
    if( extension === '.' ) extension = '';                                    // Cuesta borrar archivos que acaban en ".".

    // Junta y devuelve el nombre
    // Ej: { image }-{ 123456789-123456789 }{ .jpg }
    return `${file.fieldname}-${uniqueSuffix}${extension}`;
}

// Marcar para exportar
module.exports = { postURL , pfpURL , clubURL ,
    uploadPostImage , deletePostImage , uploadPfp , deletePfp , uploadClubImage , deleteClubImage }