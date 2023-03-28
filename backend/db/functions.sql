-- Usar base de datos
USE hikinbd;

-- PROCEDIMIENTOS --
-- Validar usuario
DROP FUNCTION IF EXISTS hikinbd.validar_usuario;

DELIMITER $$

CREATE FUNCTION hikinbd.validar_usuario(
  IN id_usuario INT UNSIGNED,
  IN es_admin BOOLEAN
) RETURNS BOOLEAN DETERMINISTIC
BEGIN
  IF es_admin IS TRUE THEN
    RETURN EXISTS(
      SELECT * FROM administradores
      WHERE usuario = id_usuario
    );
  ELSE
    RETURN EXISTS(
      SELECT * FROM usuarios
      WHERE id = id_usuario
    );
  END IF;
END

$$

DELIMITER ;

-- TRIGGERS --
