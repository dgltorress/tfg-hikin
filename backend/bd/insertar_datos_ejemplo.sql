-- Resetear tablas
DELETE * FROM usuarios;
DELETE * FROM sigue_a;
DELETE * FROM administradores;
DELETE * FROM clubes;
DELETE * FROM miembro_de;
DELETE * FROM itinerarios;
DELETE * FROM itinerarios_largos;
DELETE * FROM resenas;
DELETE * FROM publicaciones;
DELETE * FROM kudos;
DELETE * FROM comentarios;
DELETE * FROM salidas;
DELETE * FROM participa_en;
DELETE * FROM conjuntos_valoraciones;
DELETE * FROM valoraciones;
DELETE * FROM distintivos;
DELETE * FROM recibe_distintivo;
DELETE * FROM registros_api;

-- Insertar datos --
-- Usuarios
INSERT INTO usuarios(
  id, usuario, email, contrasena, nombre,
  bio,
  sexo, fecha_nac, privado, premium,
  fecha_reg,
  ultimo_acceso,
  ipv4, imagen
) VALUES (
  1, "johndoe", "johndoe@mail.com", "", "John Doe",
  "Me gusta ir a la montaña y practicar senderismo",
  1, STR_TO_DATE( "1994-10-07" , "%Y-%m-%d" ), false, false,
  STR_TO_DATE( "2023-01-04 18:41" , "%Y-%m-%d %H:%i" ),
  STR_TO_DATE( "2023-03-17 19:20" , "%Y-%m-%d %H:%i" ),
  3310194375 , "../assets/img/pfp/2023/03/01/johndoe.jpg"
), (
  2, "janedoe", "janedoe@mail.com", "", "Jane Doe",
  "Nada como pasar un día en el campo para despejarme",
  2, STR_TO_DATE( "1998-05-17" , "%Y-%m-%d" ), false, false,
  STR_TO_DATE( "2022-11-09 10:11" , "%Y-%m-%d %H:%i" ),
  STR_TO_DATE( "2023-01-10 19:20" , "%Y-%m-%d %H:%i" ),
  2283231080 , "../assets/img/pfp/2023/03/01/janedoe.jpg"
), (
  3, "joeblow", "joeblow@mail.com", "", "Joe Blow",
  "Paso a paso",
  1, STR_TO_DATE( "2001-02-22" , "%Y-%m-%d" ), false, true,
  STR_TO_DATE( "2023-01-12 09:31" , "%Y-%m-%d %H:%i" ),
  STR_TO_DATE( "2023-03-19 19:20" , "%Y-%m-%d %H:%i" ),
  820021400 , "../assets/img/pfp/2023/03/01/joeblow.jpg"
), (
  4, "janesmith", "janesmith@mail.com", "", "Jane Smith",
  "ESTE PERFIL ES PRIVADO",
  2, STR_TO_DATE( "1996-08-09" , "%Y-%m-%d" ), true, false,
  STR_TO_DATE( "2023-02-05 18:41" , "%Y-%m-%d %H:%i" ),
  STR_TO_DATE( "2023-03-17 19:20" , "%Y-%m-%d %H:%i" ),
  1387731500 , "../assets/img/pfp/2023/03/01/janesmith.jpg"
), (
  5, "dickroe", "dickroe@mail.com", "", "Dick Roe",
  "10 años (y contando) de experiencia en senderismo",
  0, STR_TO_DATE( "1990-12-01" , "%Y-%m-%d" ), true, true,
  STR_TO_DATE( "2023-01-04 18:41" , "%Y-%m-%d %H:%i" ),
  STR_TO_DATE( "2023-03-17 19:20" , "%Y-%m-%d %H:%i" ),
  1875640622 , "../assets/img/pfp/2023/03/01/dickroe.jpg"
);

-- Seguimientos entre usuarios
INSERT INTO sigue_a( seguidor , seguido ) VALUES
  ( 2 , 1 ),
  ( 3 , 1 ),
  ( 4 , 1 ),
  ( 1 , 2 ),
  ( 3 , 2 ),
  ( 1 , 3 ),
  ( 2 , 3 ),
  ( 4 , 3 ),
  ( 5 , 4 );

-- Administradores
INSERT INTO administradores( usuario , telefono ) VALUES
  ( 5 , "123456789" );

-- Clubes
INSERT INTO clubes(
  id, nombre,
  descripcion,
  localidad, propietario, privado,
  imagen
) VALUES (
  1, "Club de senderismo ARAGÓN",
  "En este club se organizan salidas a itinerarios de Aragón",
  10, 1, false,
  "../assets/img/club/2023/03/01/clubaragon.jpg"
), (
  2, "Grupo de rutas PR",
  "Club casual donde salimos de vez en cuando a rutas de pequeño recorrido en el País Vasco",
  62, 1, false,
  "../assets/img/club/2023/03/01/grupopr.jpg"
);

-- Membresías de clubes
INSERT INTO miembro_de( usuario , club ) VALUES
  ( 1 , 1 ),
  ( 2 , 1 ),
  ( 3 , 1 ),
  ( 2 , 2 ),
  ( 4 , 2 );

-- Itinerarios
INSERT INTO itinerarios(
  id, cod, localidad, denominacion, 
  descripcion, 
  distancia, dificultad, desnivel, tiempo, 
  circular, latitud, longitud, promotor, 
  url
) VALUES (
  1, "PR-TE 5", 12, "Albarracín - Saldón",
  "Del pueblo de Albarracín parten muchas sendas que nos llevan a descubrir lugares de la geografía turolense, una de éstas es la que se dirige a Saldón. Al principio el recorrido es compartido con el GR 10, pero una vez adentrados en el cañón, el PR toma un desvío a la derecha, internándose por unos metros en la maleza, se sale del cañón por ese lateral siguiendo las marcas blancas y amarillas, las cuales nos guiarán hasta Saldón.\r\nEste paseo nos permite observar en pocos kilómetros la diversidad de paisajes que se dan en Albarracín.",
  12925, 2, 733, 236,
  false, 40.411645, -1.432478, "Comarca de la Sierra de Albarracín",
  "https://senderosturisticos.turismodearagon.com/ruta/ficha/2074"
), (
  2, "GR-123", 64, "Vuelta a Bizkaia",
  "El trazado del sendero GR® 123 en fase de regularización ante la Federación Vizcaína de Montaña, recorre a través de sus 19 etapas la periferia del Territorio Histórico de Bizkaia.\r\nEl tramo del mismo que abarca la línea costera de Bizkaia, desde Ondarroa hasta Muskiz, a su vez dará continuidad en Bizkaia al Sendero Litoral Europeo E9.\r\nProcedente de Francia, el E9 atraviesa Gipuzkoa y continúa por Cantabria, Asturias y Galicia, para adentrarse finalmente en Portugal.",
  402890, 1, 17963, NULL,
  true, 43.219466, -3.438176, "Diputación Foral de Bizkaia",
  "https://www.bizkaia.eus/es/gr123"
), (
  3, "PR-PA 6", 64, "Senda de la Laguna de las Lomas",
  "Senda de aproximadamente 12 Km, ida y vuelta. Balizada en toda su longitud, de dificultad media, presenta unos paisajes admirables.",
  12000, 3, 640, 300,
  true, 42.970820, -4.757258, "Diputación Foral de Bizkaia",
  "https://www.bizkaia.eus/es/gr123"
);

CREATE TABLE itinerarios (
  id           INT UNSIGNED       auto_increment ,
  cod          VARCHAR( 10 )      NOT NULL ,
  localidad    INT UNSIGNED       NOT NULL ,
  denominacion VARCHAR( 60 )      NOT NULL ,
  descripcion  VARCHAR( 250 )              ,
  distancia    INT UNSIGNED       NOT NULL ,
  dificultad   TINYINT( 1 )       NOT NULL ,
  desnivel     SMALLINT UNSIGNED           ,
  tiempo       INT UNSIGNED                ,
  circular     BOOLEAN                     ,
  latitud      DECIMAL( 8 , 6 )            ,
  longitud     DECIMAL( 9 , 6 )            ,
  promotor     VARCHAR( 40 )               ,
  url          VARCHAR( 100 )

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
)

-- Reseñas
CREATE TABLE resenas (
  usuario       INT UNSIGNED                   ,
  itinerario    INT UNSIGNED                   ,
  valoracion    TINYINT( 1 ) UNSIGNED NOT NULL ,
  observaciones VARCHAR( 250 )                 ,
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
  descripcion VARCHAR( 120 ) NOT NULL ,
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
  FOREIGN KEY ( usuario )  REFERENCES usuarios( id ) ON DELETE CASCADE ,
  FOREIGN KEY ( publicacion ) REFERENCES publicaciones( id ) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Comentarios
CREATE TABLE comentarios (
  id          INT UNSIGNED   auto_increment ,
  publicacion INT UNSIGNED            ,
  autor       INT UNSIGNED   NOT NULL ,
  texto       VARCHAR( 120 ) NOT NULL ,
  fecha       DATETIME       NOT NULL ,

  PRIMARY KEY ( id , publicacion ) ,
  FOREIGN KEY ( publicacion ) REFERENCES publicaciones( id ) ON DELETE CASCADE ,
  FOREIGN KEY ( autor )       REFERENCES usuarios( id ) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Salidas
CREATE TABLE salidas (
  id           INT UNSIGNED   auto_increment ,
  nombre       VARCHAR( 60 )  NOT NULL ,
  descripcion  VARCHAR( 600 ) NOT NULL ,
  organizador  INT UNSIGNED   NOT NULL ,
  club         INT UNSIGNED            ,
  itinerario   INT UNSIGNED   NOT NULL ,
  fecha_inicio DATETIME       NOT NULL ,
  fecha_fin    DATETIME       NOT NULL ,
  privada      BOOLEAN        NOT NULL ,
  cancelada    BOOLEAN        NOT NULL ,

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
  FOREIGN KEY ( valorado ) REFERENCES usuarios( id ) ON DELETE CASCADE ,
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
  url     VARCHAR( 80 )     NOT NULL ,
  metodo  TINYINT( 1 )      NOT NULL ,
  funcion VARCHAR( 30 )     NOT NULL ,
  estado  SMALLINT UNSIGNED NOT NULL ,
  msg     VARCHAR( 80 )              ,

  PRIMARY KEY ( id ) ,
  FOREIGN KEY ( usuario ) REFERENCES usuarios( id ) ON DELETE SET NULL
) ENGINE = InnoDB;