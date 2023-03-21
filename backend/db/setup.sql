-- BASE DE DATOS --
DROP DATABASE IF EXISTS hikinbd; -- La borra si ya estaba
CREATE DATABASE hikinbd CHARACTER SET utf8mb4;
USE hikinbd;

-- USUARIOS --
-- Usuario administrador
DROP USER IF EXISTS 'hikinadmin'@'localhost'; -- Lo borra si ya estaba
flush privileges;
CREATE USER 'hikinadmin'@'localhost' IDENTIFIED BY 'hikinpass';
GRANT ALL ON hikinbd.* TO 'hikinadmin'@'localhost';

-- TABLAS --
-- Usuarios
CREATE TABLE usuarios (
  id            INT UNSIGNED          auto_increment ,
  usuario       VARCHAR( 15 )         NOT NULL ,
  email         VARCHAR( 60 )         NOT NULL ,
  contrasena    VARCHAR( 80 )         NOT NULL ,
  nombre        VARCHAR( 40 )         NOT NULL ,
  bio           VARCHAR( 120 )                 ,
  sexo          TINYINT( 1 ) UNSIGNED NOT NULL DEFAULT 0     ,
  fecha_nac     DATE                           ,
  privado       BOOLEAN               NOT NULL DEFAULT false ,
  premium       BOOLEAN               NOT NULL DEFAULT false ,
  fecha_reg     DATETIME              NOT NULL ,
  ultimo_acceso DATETIME                       ,
  ipv4          INT UNSIGNED          NOT NULL ,
  imagen        VARCHAR( 60 )                  ,

  PRIMARY KEY ( id ) ,
  UNIQUE ( email )

) ENGINE = InnoDB;

-- Seguimientos entre usuarios
CREATE TABLE sigue_a (
  seguidor INT UNSIGNED ,
  seguido  INT UNSIGNED ,

  PRIMARY KEY ( seguidor , seguido ) ,
  FOREIGN KEY ( seguidor ) REFERENCES usuarios( id ) ON DELETE CASCADE ,
  FOREIGN KEY ( seguido )  REFERENCES usuarios( id ) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Administradores
CREATE TABLE administradores (
  usuario  INT UNSIGNED  ,
  telefono VARCHAR( 20 ) ,

  PRIMARY KEY ( usuario ) ,
  FOREIGN KEY ( usuario ) REFERENCES usuarios( id ) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Autonomías
CREATE TABLE autonomias (
  cod    TINYINT( 2 ) UNSIGNED ,
  nombre VARCHAR( 30 )         ,

  PRIMARY KEY ( cod )
) ENGINE = InnoDB;

-- Provincias
CREATE TABLE provincias (
  cod    TINYINT( 2 ) UNSIGNED ,
  nombre VARCHAR( 30 )         ,

  PRIMARY KEY ( cod )
) ENGINE = InnoDB;

-- Localidades
CREATE TABLE localidades (
  id      INT UNSIGNED          auto_increment ,
  codauto TINYINT( 2 ) UNSIGNED NOT NULL ,
  cpro    TINYINT( 2 ) UNSIGNED ,

  PRIMARY KEY ( id ) ,
  UNIQUE ( codauto , cpro ) ,
  FOREIGN KEY ( codauto ) REFERENCES autonomias( cod ) ON DELETE CASCADE ,
  FOREIGN KEY ( cpro )    REFERENCES provincias( cod ) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Clubes
CREATE TABLE clubes (
  id          INT UNSIGNED   auto_increment ,
  nombre      VARCHAR( 60 )  NOT NULL ,
  descripcion VARCHAR( 200 )          ,
  localidad   INT UNSIGNED   NOT NULL ,
  propietario INT UNSIGNED   NOT NULL ,
  privado     BOOLEAN        NOT NULL DEFAULT false ,
  imagen      VARCHAR( 60 )           ,

  PRIMARY KEY ( id ) ,
  FOREIGN KEY ( localidad )   REFERENCES localidades( id ) ON DELETE CASCADE ,
  FOREIGN KEY ( propietario ) REFERENCES usuarios( id ) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Membresías de clubes
CREATE TABLE miembro_de (
  usuario INT UNSIGNED ,
  club    INT UNSIGNED ,

  PRIMARY KEY ( usuario , club ) ,
  FOREIGN KEY ( usuario ) REFERENCES usuarios( id ) ON DELETE CASCADE ,
  FOREIGN KEY ( club )    REFERENCES clubes( id ) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Itinerarios
CREATE TABLE itinerarios (
  id           INT UNSIGNED       auto_increment ,
  cod          VARCHAR( 10 )      NOT NULL ,
  localidad    INT UNSIGNED       NOT NULL ,
  denominacion VARCHAR( 60 )      NOT NULL ,
  descripcion  VARCHAR( 750 )              ,
  distancia    INT UNSIGNED       NOT NULL ,
  dificultad   TINYINT( 1 )       NOT NULL DEFAULT 0 ,
  desnivel     INT UNSIGNED                ,
  tiempo       INT UNSIGNED                ,
  circular     BOOLEAN                     ,
  latitud      DECIMAL( 8 , 6 )            ,
  longitud     DECIMAL( 9 , 6 )            ,
  promotor     VARCHAR( 60 )               ,
  uri          VARCHAR( 120 )              ,

  PRIMARY KEY ( id ) ,
  UNIQUE ( cod ) ,
  FOREIGN KEY ( localidad ) REFERENCES localidades( id ) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Itinerarios largos
CREATE TABLE itinerarios_largos (
  itinerario     INT      UNSIGNED ,
  pernoctaciones SMALLINT UNSIGNED ,

  PRIMARY KEY ( itinerario ) ,
  FOREIGN KEY ( itinerario ) REFERENCES itinerarios( id ) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Reseñas
CREATE TABLE resenas (
  usuario       INT UNSIGNED                   ,
  itinerario    INT UNSIGNED                   ,
  valoracion    TINYINT( 1 ) UNSIGNED NOT NULL ,
  observaciones VARCHAR( 750 )                 ,
  fecha         DATETIME              NOT NULL ,

  PRIMARY KEY ( usuario , itinerario ) ,
  FOREIGN KEY ( usuario )    REFERENCES usuarios( id ) ON DELETE CASCADE ,
  FOREIGN KEY ( itinerario ) REFERENCES itinerarios( id ) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Publicaciones
CREATE TABLE publicaciones (
  id          INT UNSIGNED   auto_increment,
  autor       INT UNSIGNED   NOT NULL ,
  titulo      VARCHAR( 50 )  NOT NULL ,
  descripcion VARCHAR( 250 ) NOT NULL ,
  club        INT UNSIGNED            ,
  itinerario  INT UNSIGNED            ,
  imagen      VARCHAR( 60 )           ,
  fecha       DATETIME       NOT NULL ,

  PRIMARY KEY ( id ) ,
  FOREIGN KEY ( autor )      REFERENCES usuarios( id ) ON DELETE CASCADE ,
  FOREIGN KEY ( club )       REFERENCES clubes( id ) ON DELETE CASCADE ,
  FOREIGN KEY ( itinerario ) REFERENCES itinerarios( id ) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Kudos
CREATE TABLE kudos (
  usuario     INT UNSIGNED ,
  publicacion INT UNSIGNED ,

  PRIMARY KEY ( usuario , publicacion ) ,
  FOREIGN KEY ( usuario )     REFERENCES usuarios( id ) ON DELETE CASCADE ,
  FOREIGN KEY ( publicacion ) REFERENCES publicaciones( id ) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Comentarios
CREATE TABLE comentarios (
  id          INT UNSIGNED   auto_increment ,
  publicacion INT UNSIGNED            ,
  autor       INT UNSIGNED   NOT NULL ,
  texto       VARCHAR( 150 ) NOT NULL ,
  fecha       DATETIME       NOT NULL ,

  PRIMARY KEY ( id , publicacion ) ,
  FOREIGN KEY ( publicacion ) REFERENCES publicaciones( id ) ON DELETE CASCADE ,
  FOREIGN KEY ( autor )       REFERENCES usuarios( id ) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Salidas
CREATE TABLE salidas (
  id           INT UNSIGNED   auto_increment ,
  nombre       VARCHAR( 80 )  NOT NULL ,
  descripcion  VARCHAR( 600 ) NOT NULL ,
  organizador  INT UNSIGNED   NOT NULL ,
  club         INT UNSIGNED            ,
  itinerario   INT UNSIGNED   NOT NULL ,
  fecha_inicio DATETIME       NOT NULL ,
  fecha_fin    DATETIME       NOT NULL ,
  privada      BOOLEAN        NOT NULL DEFAULT false ,
  cancelada    BOOLEAN        NOT NULL DEFAULT false ,

  PRIMARY KEY ( id ) ,
  FOREIGN KEY ( organizador ) REFERENCES usuarios( id ) ON DELETE CASCADE ,
  FOREIGN KEY ( itinerario )  REFERENCES itinerarios( id ) ON DELETE CASCADE ,
  FOREIGN KEY ( club )        REFERENCES clubes( id ) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Participantes de salidas
CREATE TABLE participa_en (
  usuario INT UNSIGNED ,
  salida  INT UNSIGNED ,

  PRIMARY KEY ( usuario , salida ) ,
  FOREIGN KEY ( usuario ) REFERENCES usuarios( id ) ON DELETE CASCADE ,
  FOREIGN KEY ( salida )  REFERENCES salidas( id ) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Conjuntos de valoraciones
CREATE TABLE conjuntos_valoraciones (
  id      INT UNSIGNED auto_increment ,
  usuario INT UNSIGNED NOT NULL ,
  salida  INT UNSIGNED NOT NULL ,
  fecha   DATETIME     NOT NULL ,

  PRIMARY KEY ( id ) ,
  UNIQUE ( usuario , salida ) ,
  FOREIGN KEY ( usuario , salida ) REFERENCES participa_en( usuario , salida ) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Valoraciones
CREATE TABLE valoraciones (
  id            INT UNSIGNED          auto_increment ,
  conjunto      INT UNSIGNED                   ,
  valorado      INT UNSIGNED          NOT NULL ,
  acude         BOOLEAN               NOT NULL ,
  valoracion    TINYINT( 1 ) UNSIGNED NOT NULL ,
  observaciones VARCHAR( 250 )                 ,

  PRIMARY KEY ( id , conjunto ) ,
  FOREIGN KEY ( conjunto ) REFERENCES conjuntos_valoraciones( id ) ON DELETE CASCADE ,
  FOREIGN KEY ( valorado ) REFERENCES usuarios( id ) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Distintivos
CREATE TABLE distintivos (
  id          INT UNSIGNED   auto_increment ,
  nombre      VARCHAR( 50 )  NOT NULL ,
  descripcion VARCHAR( 100 ) NOT NULL ,
  imagen      VARCHAR( 60 )  NOT NULL ,

  PRIMARY KEY ( id )
) ENGINE = InnoDB;

-- Asignación de distintivos
CREATE TABLE recibe_distintivo (
  usuario    INT UNSIGNED ,
  distintivo INT UNSIGNED ,

  PRIMARY KEY ( usuario , distintivo ) ,
  FOREIGN KEY ( usuario )    REFERENCES usuarios( id ) ON DELETE CASCADE ,
  FOREIGN KEY ( distintivo ) REFERENCES distintivos( id ) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Registros de la API
CREATE TABLE registros_api (
  id      INT UNSIGNED      auto_increment ,
  usuario INT UNSIGNED               ,
  fecha   DATETIME          NOT NULL ,
  ipv4    INT UNSIGNED      NOT NULL ,
  uri     VARCHAR( 80 )     NOT NULL ,
  metodo  TINYINT( 1 )      NOT NULL DEFAULT 0 ,
  funcion VARCHAR( 30 )     NOT NULL ,
  estado  SMALLINT UNSIGNED NOT NULL ,
  msg     VARCHAR( 80 )              ,

  PRIMARY KEY ( id ) ,
  FOREIGN KEY ( usuario ) REFERENCES usuarios( id ) ON DELETE SET NULL
) ENGINE = InnoDB;