/**
 * HELPER: Constantes de uso general
 */

'use strict';

// Respuestas HTTP (a 26/10/2022).

const HTTP = {
    'info': {
        'continue': 100 , // Continua
        'switch':   101 , // Cambio de protocolo

        // WebDAV
        'processing': 102 , // Procesando

        'hints': 103 // Precarga recursos mientras el servidor prepara respuesta
    } ,
    'success': {
        'ok':          200 , // Aceptado (el significado depende de la operacion)
        'created':     201 , // Creado (para POST y determinados PUT)
        'accepted':    202 , // Aceptado
        'third_party': 203 , // Informacion de otro servidor
        'no_content':  204 , // Sin contenido
        'reset':       205 , // Contenido y reiniciar pagina
        'partial':     206 , // Contenido parcial

        // WebDAV y Delta encoding
        'multistatus':      207 , // Multiestado (varios codigos en el cuerpo de la respuesta)
        'already_reported': 208 , // Ya reportado
        'im_used':          226   // Cambios parciales a un recurso ya cacheado
    } ,
    'redirect': {
        'multiple':      300 , // Multiples posibilidades
        'moved':         301 , // Mudado permanentemente
        'found':         302 , // Encontrado
        'see_other':     303 , // Vea otros
        'not_modified':  304 , // No modificado
        'use_proxy':     305 , // Utilice un proxy <------------ DEPRECADO
        'UNUSED':        306 , // SIN UTILIZAR
        'redirect_temp': 307 , // Redireccion temporal
        'redirect':      308   // Redireccion permanente
    } ,
    'error_client': {
        'bad_request':           400 , // Solicitud incorrecta
        'unauthorized':          401 , // No autorizado
        'payment_required':      402 , // Pago requerido <--------------------- EXPERIMENTAL
        'forbidden':             403 , // Prohibido
        'not_found':             404 , // No encontrado
        'not_allowed':           405 , // Método no permitido
        'not_acceptable':        406 , // No aceptable
        'proxy_required':        407 , // Proxy requerido
        'timeout_request':       408 , // Tiempo de espera de la solicitud agotado
        'conflict':              409 , // Conflicto
        'gone':                  410 , // Recurso borrado permanentemente
        'length_required':       411 , // Requiere longitud
        'precondition_failed':   412 , // Fallo precondicion
        'too_large_payload':     413 , // Entidad de solicitud demasiado grande
        'too_long_uri':          414 , // URI de solicitud demasiado largo
        'unsupported_media':     415 , // Tipo de medio no soportado
        'range_not_satisfiable': 416 , // Rango solicitado no disponible
        'expectation_failed':    417 , // Falló expectativa
        'teapot':                418 , //  <----------------- DE BROMA

        // WebDAV
        'misdirected':       421 , // Solicitud 
        'unprocessable':     422 , // Errores semanticos en la solicitud
        'locked':            423 , // Recurso sellado
        'failed_dependency': 424 , // Fallo debido al fallo de una solicitud previa

        'too_early':             425 , // Demasiado pronto
        'upgrade_required':      426 , // Cambio de protocolo requerido (protocolo especificado en una cabecera Upgrade)
        'precondition_required': 428 , // Precondicion requerida
        'too_many_requests':     429 , // Demasiadas solicitudes
        'too_large_header':      431 , // Cabecera demasiado grande
        'illegal':               451   // No disponible por motivos legales
    } ,
    'error_server': {
        'internal':            500 , // Error interno
        'not_implemented':     501 , // No implementado
        'bad_gateway':         502 , // Pasarela incorrecta
        'service_unavailable': 503 , // Servicio no disponible
        'timeout_gateway':     504 , // Tiempo de espera de la pasarela agotado
        'version_unsupported': 505 , // Versión de HTTP no soportada
        'variant_also':        506 , // El recurso no es un objetivo final, sino que hace mas solicitudes

        // WebDAV
        'storage_insufficient' : 507 , // Espacio insuficiente
        'loop' :                 508 , // Bucle infinito

        'extensions_required':    510 , // Extensiones a la solicitud requeridas
        'network_auth_required' : 511   // Autenticacion de red requerida
    }
}


// Colores de terminal como codigos de escape ANSI.

const COLOR = {
    'texto': {
        'negro':    '\u001b[30m' ,
        'rojo':     '\u001b[31m' ,
        'verde':    '\u001b[32m' ,
        'amarillo': '\u001b[33m' ,
        'azul':     '\u001b[34m' ,
        'magenta':  '\u001b[35m' ,
        'cian':     '\u001b[36m' ,
        'blanco':   '\u001b[37m' ,
    } ,
    'fondo': { // Los fondos pueden incluir un ajuste al color del texto para que sea legible.
        'negro':    '\u001b[40;1m\u001b[37m' ,
        'rojo':     '\u001b[41;1m'           ,
        'verde':    '\u001b[42;1m'           ,
        'amarillo': '\u001b[43;1m'           ,
        'azul':     '\u001b[44;1m'           ,
        'magenta':  '\u001b[45;1m'           ,
        'cian':     '\u001b[46;1m'           ,
        'blanco':   '\u001b[47;1m\u001b[30m' ,
    } ,
    'reset': '\u001b[0m'
}


// Nombres y colores de solicitudes (a efectos de personalizacion).

const PETICIONES = {
    'GET': {
        'prefijo': 'GET' ,
        'color': COLOR.fondo.azul
    } ,
    'POST': {
        'prefijo': 'POST' ,
        'color': COLOR.fondo.verde
    } ,
    'PUT': {
        'prefijo': 'PUT' ,
        'color': COLOR.fondo.amarillo
    } ,
    'PATCH': {
        'prefijo': 'PATCH' ,
        'color': COLOR.fondo.cian
    } ,
    'DELETE': {
        'prefijo': 'DELETE' ,
        'color': COLOR.fondo.rojo
    } ,
    'UNKNOWN': {
        'prefijo': '???' ,
        'color': COLOR.fondo.magenta
    }
}

// Filtro para busquedas de texto por parametro query.

const textRegExEsp =  /[^A-Za-z1-9ÁÉÍÓÚÑáéíóúñ ]/;


// Marcar todo para exportar

module.exports = {
    HTTP ,
    COLOR ,
    PETICIONES ,
    textRegExEsp
}