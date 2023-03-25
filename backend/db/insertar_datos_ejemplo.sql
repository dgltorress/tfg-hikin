-- Usar base de datos
USE hikinbd;

-- Resetear tablas
DELETE FROM usuarios;
DELETE FROM sigue_a;
DELETE FROM administradores;
DELETE FROM clubes;
DELETE FROM miembro_de;
DELETE FROM itinerarios;
DELETE FROM itinerarios_largos;
DELETE FROM resenas;
DELETE FROM publicaciones;
DELETE FROM kudos;
DELETE FROM comentarios;
DELETE FROM salidas;
DELETE FROM participa_en;
DELETE FROM conjuntos_valoraciones;
DELETE FROM valoraciones;
DELETE FROM distintivos;
DELETE FROM recibe_distintivo;
DELETE FROM registros_api;

-- Insertar datos --
-- Usuarios
INSERT INTO usuarios(
  id, usuario, email,
  contrasena,
  nombre, bio,
  sexo, fecha_nac, privado, premium,
  fecha_reg,
  ultimo_acceso,
  ipv4, imagen
) VALUES (
  1, "johndoe", "johndoe@mail.com",
  "$2b$10$YEHION7LeQBsnpAm5FRti.uspPxYEW6r0FhWdrmS4sn6LyBUuHhMm",
  "John Doe", "Me gusta ir a la montaña y practicar senderismo",
  1, STR_TO_DATE( "1994-10-07" , "%Y-%m-%d" ), false, false,
  STR_TO_DATE( "2023-01-04 18:41" , "%Y-%m-%d %H:%i" ),
  STR_TO_DATE( "2023-03-17 19:20" , "%Y-%m-%d %H:%i" ),
  3310194375 , "../assets/img/pfp/2023/3/1/johndoe.jpg"
), (
  2, "janedoe", "janedoe@mail.com",
  "$2b$10$iKqvfz2BZ0M4V1cUSCx7QOyrxOLIRku7hYz5b//2X9H2ktCo6Eg8S",
  "Jane Doe", "Nada como pasar un día en el campo para despejarme",
  2, STR_TO_DATE( "1998-05-17" , "%Y-%m-%d" ), false, false,
  STR_TO_DATE( "2022-11-09 10:11" , "%Y-%m-%d %H:%i" ),
  STR_TO_DATE( "2023-01-10 19:20" , "%Y-%m-%d %H:%i" ),
  2283231080 , "../assets/img/pfp/2023/3/1/janedoe.jpg"
), (
  3, "joeblow", "joeblow@mail.com",
  "$2b$10$z5NkBqLik9BMPS5qo4l8MuLwZ3AHHZeeIeZsx6nBCMHVJ/7mPtrV2",
  "Joe Blow", "Paso a paso",
  1, STR_TO_DATE( "2001-02-22" , "%Y-%m-%d" ), false, true,
  STR_TO_DATE( "2023-01-12 09:31" , "%Y-%m-%d %H:%i" ),
  STR_TO_DATE( "2023-03-19 19:20" , "%Y-%m-%d %H:%i" ),
  820021400 , "../assets/img/pfp/2023/3/1/joeblow.jpg"
), (
  4, "janesmith", "janesmith@mail.com",
  "$2b$10$KkEktzCKGTknL9fVe9MjReJY8.czXtq2xw/./Rn05YvY01VEbLAl.",
  "Jane Smith", "ESTE PERFIL ES PRIVADO",
  2, STR_TO_DATE( "1996-08-09" , "%Y-%m-%d" ), true, false,
  STR_TO_DATE( "2023-02-05 18:41" , "%Y-%m-%d %H:%i" ),
  STR_TO_DATE( "2023-03-17 19:20" , "%Y-%m-%d %H:%i" ),
  1387731500 , "../assets/img/pfp/2023/3/1/janesmith.jpg"
), (
  5, "dickroe", "dickroe@mail.com",
  "$2b$10$9KvDd6lRmed.iEJ/qZ1lAuTT5zwH5UWEwk2xvUETU1/gye8x2uwH6",
  "Dick Roe", "10 años (y contando) de experiencia en senderismo",
  0, STR_TO_DATE( "1990-12-01" , "%Y-%m-%d" ), true, true,
  STR_TO_DATE( "2023-01-04 18:41" , "%Y-%m-%d %H:%i" ),
  STR_TO_DATE( "2023-03-17 19:20" , "%Y-%m-%d %H:%i" ),
  1875640622 , "../assets/img/pfp/2023/3/1/dickroe.jpg"
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
  "../assets/img/club/2023/03/01/club1.jpg"
), (
  2, "Grupo de rutas PR",
  "Club casual donde salimos de vez en cuando a rutas de pequeño recorrido en el País Vasco",
  62, 2, false,
  "../assets/img/club/2023/03/01/club2.jpg"
), (
  3, "Salidas MADRID",
  "Salidas por Madrid",
  56, 1, true,
  "../assets/img/club/2023/03/01/club3.jpg"
);

-- Membresías de clubes
INSERT INTO miembro_de( usuario , club ) VALUES
  ( 1 , 1 ),
  ( 2 , 1 ),
  ( 3 , 1 ),
  ( 2 , 2 ),
  ( 4 , 2 ),
  ( 1 , 3 );

-- Itinerarios
INSERT INTO itinerarios(
  id, cod, localidad, denominacion, 
  descripcion, 
  distancia, dificultad, desnivel, tiempo, 
  circular, latitud, longitud, promotor, 
  uri
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
  3, "PR-PA 6", 27, "Senda de la Laguna de las Lomas",
  "Senda de aproximadamente 12 Km, ida y vuelta. Balizada en toda su longitud, de dificultad media, presenta unos paisajes admirables.",
  12000, 3, 640, 300,
  true, 42.971667, -4.755833, "Junta de Castilla y León",
  "https://www.turismocastillayleon.com/es/rural-naturaleza/rutas-naturaleza/sendas-lagunas-lomas"
);

-- Itinerarios largos
INSERT INTO itinerarios_largos( itinerario , pernoctaciones ) VALUES
  ( 2 , 12 );

-- Reseñas
INSERT INTO resenas (
  usuario, itinerario, valoracion,
  observaciones,
  fecha
) VALUES (
  1, 1, 4,
  "Un itinerario reciente pero sin duda muy necesario. La zona tiene buenas vistas y un gran valor histórico.",
  STR_TO_DATE( "2023-03-18 15:41" , "%Y-%m-%d %H:%i" )
), (
  1, 2, 5,
  "Si eres de quienes no les intimidan los senderos de gran recorrido, éste es uno que no te puedes perder. Empezando desde una remota zona del País Vasco, da la vuelta a toda la comunidad autónoma, pasando por infinidad de puntos de interés. Me gustó en especial la etapa 12, una de las rehomologadas durante el año pasado, en su paso por la costa del norte.",
  STR_TO_DATE( "2023-02-20 18:42" , "%Y-%m-%d %H:%i" )
), (
  2, 1, 5,
  "Una visita obligatoria si vas a practicar senderismo en Teruel. Nada que envidiar tiene a las otras rutas de Aragón.",
  STR_TO_DATE( "2023-01-30 19:01" , "%Y-%m-%d %H:%i" )
), (
  2, 3, 2,
  "Senda bien balizada, permite adentrarse en el medio rural de León sin mucha experiencia. Sin embargo, tener que realizar ida y vuelta no compensa teniendo en cuenta la casi total ausencia de puntos de interés.",
  STR_TO_DATE( "2022-11-01 21:01" , "%Y-%m-%d %H:%i" )
);

INSERT INTO publicaciones (
  id, autor, titulo, 
  descripcion, 
  club, itinerario, 
  imagen,
  fecha
) VALUES (
  1, 1, "Dando una vuelta por la ruta de Albarracín",
  "Aunque aún estamos a principios de marzo, hace un tiempo que sin duda invita a salir. Después de esto iremos a tomar algo al bar del pueblo; ¡me ha contado un pajarito que tienen un ternasco que está de muerte!",
  1, 1,
  "../assets/img/posts/2023/03/04/post1.jpg", 
  STR_TO_DATE( "2023-03-04 11:34" , "%Y-%m-%d %H:%i" )
), (
  2, 1, "¡En las costas de Vizcaya!",
  "Estamos en la etapa 12 de la ruta de gran recorrido que da la vuelta a esta encantadora provincia. Ahora mismo nos encontramos frente a la ermita de San Juan de Gaztelugatxe. ¡Se agradece que el camino esté pavimentado!",
  NULL, 2,
  "../assets/img/posts/2023/03/04/post2.jpg", 
  STR_TO_DATE( "2023-02-01 12:41" , "%Y-%m-%d %H:%i" )
), (
  3, 2, "Reunión anual del club",
  "Como uno de los primeros clubs activos de HikIn, nos enorgullece estar aquí reunidos una vez más. Por muchas aventuras más en la montaña.",
  2, NULL,
  "../assets/img/posts/2023/03/04/post3.jpg", 
  STR_TO_DATE( "2023-03-04 11:34" , "%Y-%m-%d %H:%i" )
), (
  4, 3, "Hola a todos",
  "Acabo de registrarme en HikIn, así que me presento: soy Joe Blow y desde pequeño me ha gustado practicar senderismo siempre que encontraba un hueco. Estoy por la zona de Palencia, así que si alguien se anima a salir, que no dude en contactarme.",
  NULL, NULL,
  NULL, 
  STR_TO_DATE( "2023-03-06 11:56" , "%Y-%m-%d %H:%i" )
), (
  5, 3, "Impresionantes vistas de Laguna de las Lomas",
  "El viaje hasta aquí ha valido la pena, la verdad es que deja sin aliento. ¡Y pensar que tenemos algo así tan cerca!",
  NULL, 3,
  "../assets/img/posts/2023/03/04/post5.jpg", 
  STR_TO_DATE( "2023-03-21 10:03" , "%Y-%m-%d %H:%i" )
), (
  6, 4, "PUBLICACIÓN DE USUARIO PRIVADO",
  "PUBLICACIÓN DE USUARIO PRIVADO",
  NULL, NULL,
  NULL, 
  STR_TO_DATE( "2023-03-01 10:48" , "%Y-%m-%d %H:%i" )
);

-- Kudos
INSERT INTO kudos( usuario , publicacion ) VALUES
  ( 1 , 1 ),
  ( 1 , 2 ),
  ( 1 , 3 ),
  ( 1 , 5 ),
  ( 2 , 1 ),
  ( 2 , 2 ),
  ( 2 , 3 ),
  ( 3 , 1 ),
  ( 3 , 4 ),
  ( 3 , 5 ),
  ( 4 , 1 ),
  ( 4 , 4 ),
  ( 5 , 1 ),
  ( 5 , 2 );

-- Comentarios
INSERT INTO comentarios (
  id, publicacion, autor, 
  texto, 
  fecha
) VALUES (
  1, 1, 2,
  "No hay nada como comer en un bar después después de molerse las piernas.",
  STR_TO_DATE( "2023-03-04 11:38" , "%Y-%m-%d %H:%i" )
), (
  2, 1, 3,
  "¡El descanso del guerrero!",
  STR_TO_DATE( "2023-03-04 11:46" , "%Y-%m-%d %H:%i" )
), (
  3, 1, 4,
  "Tendré que pasarme por allí algún día",
  STR_TO_DATE( "2023-03-04 11:52" , "%Y-%m-%d %H:%i" )
), (
  1, 2, 2,
  "¡Vaya experiencia! Será una ruta a tener en cuenta en cuanto me den las vacaciones.",
  STR_TO_DATE( "2023-02-02 20:01" , "%Y-%m-%d %H:%i" )
), (
  1, 5, 1,
  "Menudas vistas. Anda que os lo montáis bien por Palencia.",
  STR_TO_DATE( "2023-03-04 12:02" , "%Y-%m-%d %H:%i" )
), (
  2, 5, 2,
  "¡Qué bonito!",
  STR_TO_DATE( "2023-03-04 13:14" , "%Y-%m-%d %H:%i" )
);

-- Salidas
INSERT INTO salidas (
  id, nombre,
  descripcion, 
  organizador, club, itinerario, 
  fecha_inicio, 
  fecha_fin, 
  privada, cancelada
) VALUES (
  1, "Excursión a Albarracín",
  "El plan para esta salida es completar el itinerario de pequeño recorrido especificado a lo largo de la mañana para luego comemr en uno de los bares típicos del pueblo. Aunque el tiempo se ha vuelto un poco loco, recomiendo traer ropa de abrigo por si acaso.",
  1, 1, 1,
  STR_TO_DATE( "2023-03-04 09:00" , "%Y-%m-%d %H:%i" ),
  STR_TO_DATE( "2023-03-04 13:30" , "%Y-%m-%d %H:%i" ),
  false, false
), (
  2, "Vuelta a Vizcaya",
  "Un viaje a pie de dos semanas alrededor de la provincia de Vizcaya, donde pasaremos por una gran variedad de lugares de interés. Pernoctaremos un total de dos semanas a lo largo del recorrido en lugares acordados previamente en la hoja de ruta, disponible en [ENLACE].",
  1, NULL, 2,
  STR_TO_DATE( "2023-01-19 09:00" , "%Y-%m-%d %H:%i" ),
  STR_TO_DATE( "2023-02-01 21:00" , "%Y-%m-%d %H:%i" ),
  false, false
), (
  3, "Salida a Laguna de las Lomas",
  "Durante esta salida recorreremos la ruta homónima y contemplaremos las maravillosas vistas que ofrece. La idea es empezar sobre mediodía y acabar por la tarde, así que cada uno tendrá que traerse comida de casa.",
  3, NULL, 3,
  STR_TO_DATE( "2023-03-21 12:00" , "%Y-%m-%d %H:%i" ),
  STR_TO_DATE( "2023-03-21 17:30" , "%Y-%m-%d %H:%i" ),
  true, false
);

-- Participantes de salidas
INSERT INTO participa_en( usuario , salida ) VALUES
  ( 1 , 1 ),
  ( 1 , 3 ),
  ( 2 , 1 ),
  ( 2 , 3 ),
  ( 3 , 1 ),
  ( 3 , 3 ),
  ( 4 , 1 ),
  ( 5 , 1 );

-- Conjuntos de valoraciones
INSERT INTO conjuntos_valoraciones (
  id,
  usuario, salida, 
  fecha
) VALUES (
  1,
  1, 1,
  STR_TO_DATE( "2023-03-04 18:31" , "%Y-%m-%d %H:%i" )
), (
  2,
  2, 1,
  STR_TO_DATE( "2023-03-04 17:30" , "%Y-%m-%d %H:%i" )
), (
  3,
  3, 1,
  STR_TO_DATE( "2023-03-04 16:21" , "%Y-%m-%d %H:%i" )
), (
  4,
  4, 1,
  STR_TO_DATE( "2023-03-04 19:49" , "%Y-%m-%d %H:%i" )
), (
  5,
  5, 1,
  STR_TO_DATE( "2023-03-04 20:52" , "%Y-%m-%d %H:%i" )
),

(
  6,
  1, 3,
  STR_TO_DATE( "2023-03-21 18:12" , "%Y-%m-%d %H:%i" )
), (
  7,
  3, 3,
  STR_TO_DATE( "2023-03-21 19:07" , "%Y-%m-%d %H:%i" )
);

-- Valoraciones
INSERT INTO valoraciones (
  id,
  conjunto, valorado, acude, valoracion,
  observaciones
) VALUES (
  1,
  1, 2, true, 5,
  "Una excelente compañera de excursión. El pateo ha sido mucho más ameno gracias su presencia."
), (
  2,
  1, 3, true, 4,
  "No lo conocía de antes, y me alegro de haberlo hecho ahora. También cuenta muy buenos chistes."
), (
  3,
  1, 4, false, 1,
  NULL
), (
  4,
  1, 5, true, 3,
  "Por lo general se ha comportado correctamente, aunque a veces ha mostrado una actitud un tanto antagonista respecto al resto del grupo."
),

(
  5,
  2, 1, true, 5,
  "Uno de los mejores organizadores de salidas que he visto. No le doy seis estrellas porque no puedo."
), (
  6,
  2, 3, true, 5,
  "Un buen tío. Volvería a caminar con él."
), (
  7,
  2, 4, false, 1,
  NULL
), (
  8,
  2, 5, true, 2,
  NULL
), 

(
  9,
  3, 1, true, 4,
  NULL
), (
  10,
  3, 2, true, 5,
  "Buena persona, mejor senderista."
), (
  11,
  3, 4, false, 1,
  NULL
), (
  12,
  3, 5, true, 1,
  NULL
), 

( -- Prueba de usuario conflictivo
  13,
  4, 1, false, 1,
  "MAL COMPAÑERO"
), (
  14,
  4, 2, false, 1,
  "MAL COMPAÑERA"
), (
  15,
  4, 4, false, 1,
  "MAL COMPAÑERO"
), (
  16,
  4, 5, false, 1,
  "MAL COMPAÑERO"
), 

(
  17,
  5, 1, true, 5,
  NULL
), (
  18,
  5, 2, true, 3,
  NULL
), (
  19,
  5, 4, true, 3,
  NULL
),


(
  20,
  6, 2, true, 5,
  NULL
), (
  21,
  6, 3, true, 4,
  "Buen tipo."
), 

(
  22,
  7, 1, true, 4,
  NULL
), (
  23,
  7, 2, true, 3,
  NULL
);

-- Distintivos
INSERT INTO distintivos (
  id, nombre,
  descripcion,
  imagen
) VALUES (
  1, "Aspirante a líder",
  "Has creado un club y has conseguido que se unan dos miembros.",
  "../assets/img/distintivos/2023/03/01/distintivo1.jpg"
), (
  2, "Organizador novato",
  "Organiza una salida y consigue que se unan dos personas.",
  "../assets/img/distintivos/2023/03/01/distintivo2.jpg"
), (
  3, "Popular (en tu casa)",
  "Consigue 10 kudos en una publicación.",
  "../assets/img/distintivos/2023/03/01/distintivo3.jpg"
);

-- Asignación de distintivos
INSERT INTO recibe_distintivo( usuario , distintivo ) VALUES
  ( 1 , 1 ),
  ( 1 , 2 ),
  ( 2 , 1 );

-- Registros de la API
INSERT INTO registros_api (
  id, usuario,
  fecha,
  ipv4, uri,
  metodo, funcion, estado,
  msg
) VALUES (
  1, 1,
  STR_TO_DATE( "2023-03-12 11:39" , "%Y-%m-%d %H:%i" ),
  3310194375, "api/EJEMPLO",
  1, "getEjemplo", 200,
  "Petición exitosa"
), (
  2, NULL,
  STR_TO_DATE( "2023-03-12 11:41" , "%Y-%m-%d %H:%i" ),
  3310194375, "api/EJEMPLO",
  2, "postEjemplo", 200,
  NULL
);