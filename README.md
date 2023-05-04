# Trabajo de Fin de Grado - HikIn

## Puesta en marcha

### Requisitos

- Uno o varios **ordenadores**.
- (Opcional) Un **dispositivo móvil** Android.
- Un [**servidor MariaDB**](https://mariadb.org/download) (instalado en un ordenador).
- [**Node.js**](https://nodejs.org/en/download) (instalado en un ordenador).
- La **APK** instalada (móvil) o la **aplicación web servida** (ordenador). Ambas pueden encontrarse como una *release* en el repositorio.

### Procedimiento

1. En uno (o el único) de los ordenadores:

    1. Iniciar el servidor de MariaDB. En Windows es posible acceder a Servicios (`services.msc`) y ponerlo en marcha manualmente.

    2. Crear la base de datos. El respectivo *script* se encuentra en `/backend/db/setup.sql`.
    
        Los *scripts* pueden introducirse con la herramienta de línea de comandos oficial o mediante un cliente con interfaz gráfica como [HeidiSQL](https://www.heidisql.com/download.php).

    3. Crear las funciones y disparadores. Los respectivos *scripts* se encuentran en `/backend/db/functions.sql` y `/backend/db/triggers.sql`.

    4. Poblar la base de datos con la información mínima necesaria para funcionar. El respectivo *script* se encuentra en `/backend/db/insertar_datos_iniciales.sql`.

    5. (Opcional) Poblar la base de datos con recursos de ejemplo. El respectivo *script* se encuentra en `/backend/db/insertar_datos_ejemplo.sql`.

2. En otro (o el mismo) ordenador:

    1. Situar jerarquía de carpetas donde se guardará el contenido multimedia.

    2. Abrir un puerto o enlace para que su contenido pueda ser servido al exterior. Si se trata del mismo ordenador que el que abrirá la aplicación, puede abrirse un servidor local con [XAMPP](https://www.apachefriends.org/download.html) y añadirse un alias al archivo `xampp/apache/conf/httpd.conf`.

3. En otro (o el mismo) ordenador:

    1. Asociar a las variables de entorno de la API relativas a la base de datos (`DB_*`) la información que permita establecer una conexión con el ordenador que sirve la base de datos y acceder a ella como administrador. Estas variables se encuentran en:
    
        - El *archivo de variables de entorno de la API* (`/backend/api/.env`). Aquí se encuentran las que utiliza la API.
        
        - La *plantilla de variables de entorno de la API* (`/backend/api/.env.example`). Aquí se explica el significado de cada (NO se utiliza).

        Será necesario disponer de un usuario con permisos de administrador sobre la base de datos. Éste puede ser el usuario global `root` (si no se ha modificado), el usuario `hikinadmin` que se crea con el *script* `setup.sql` o cualquier otro que disponga de dichos permisos.

    2. Generar un token criptográficamente seguro, secreto y hexadecimal de 32 bytes y asociarlo a la variable `JWT_SECRET` del archivo de variables de entorno. Node.js puede generar un token con estas características por medio del siguiente comando:
    
        ```sh
        node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
        ```

        Opcionalmente, es posible establecer un tiempo de caducidad específico para los tokens de usuario en la variable `JWT_EXPIRE`, que por defecto duran 24 horas.

    3. Configurar los directorios donde se guardará cada tipo de recurso multimedia en el archivo de variables de entorno.

    4. (Opcional) Asociar un puerto y parámetros alternativos con los que abrir la API en el archivo de variables de entorno. Por defecto se abrirá en `localhost:3000`.

    5. (Opcional) Modificar los ajustes de registros en el archivo de variables de entorno. Por defecto, los registros se muestran por consola y no se almacenan.

    6. (Opcional) Abrir un puerto o enlace de servidor si se van a realizar peticiones desde fuera del entorno local (por ejemplo, si se va a probar desde un dispositivo móvil).

4. En un dispositivo móvil u otro (o el mismo) ordenador.

    1. Abrir la aplicación móvil (`hikin.apk`) o acceder localmente o desde un segundo ordenador a la aplicación web (con archivos listos para servir en `www/*`).

    2. Si se ha abierto desde un dispositivo móvil o un ordenador que NO esté sirviendo también la API, acceder al menú de ajustes de la aplicación e introducir el enlace donde la API está siendo servida.

Si se han seguido estos pasos, la aplicación estará puesta en marcha y será completamente funcional.