-- Usar base de datos
USE hikinbd;

-- PROCEDIMIENTOS --
-- Validar usuario
DROP TRIGGER IF EXISTS hikinbd.incremento_comentario;

DELIMITER $$

CREATE TRIGGER incremento_comentario
BEFORE INSERT ON comentarios
FOR EACH ROW
BEGIN
  SET NEW.id = IFNULL( (
    SELECT MAX( id ) + 1
    FROM comentarios
    WHERE publicacion = NEW.publicacion
  ), 1 );
END $$

DELIMITER ;

-- TRIGGERS --
