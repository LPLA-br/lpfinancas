/*################# PROCEDIMENTOS ##################*/


-------------CD DOS USUÁRIOS-------------

CREATE OR REPLACE PROCEDURE criar_conta_usuario
(
	IN login_inp VARCHAR(20),
	IN senha_inp VARCHAR(50)
)
AS $$
	INSERT INTO usuarios( login, senha )
	VALUES ( login_inp, senha_inp );
$$ LANGUAGE SQL;

CREATE OR REPLACE PROCEDURE deletar_conta_usuario
(
	IN login_inp VARCHAR(20),
	IN senha_inp VARCHAR(50)
)
AS $$
DECLARE
	verif VARCHAR(20);
	id_elimidado INT;
BEGIN
	SELECT login
	INTO verif
	FROM usuarios
	WHERE login = login_inp;

	IF NOT FOUND THEN
		RAISE EXCEPTION 'Erro: usuario com login % não existe', login_inp;
	END IF;

	DELETE FROM usuarios
	WHERE login = login_inp AND senha = senha_inp;

	SELECT id
	INTO id_elimidado
	FROM usuarios
	WHERE login = login_inp;

	DELETE FROM entradas
	WHERE recebedor = id_elimidado;

	DELETE FROM saidas
	WHERE pagador = id_elimidado;

	DELETE FROM carteiras
	WHERE proprietario = id_elimidado;
END;
$$ LANGUAGE PLPGSQL;


-------------CD DAS CARTEIRAS-------------

CREATE OR REPLACE PROCEDURE adicionar_carteira
(
	IN unidade_monetaria_inp CHAR(3),
	IN motante_inp FLOAT,
	IN proprietario_inp INT
)
AS $$
BEGIN
	INSERT INTO carteiras( unidade_monetaria, motante, proprietario )
	VALUES( unidade_monetaria_inp, motante_inp, proprietario_inp );
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE PROCEDURE deletar_carteira
(
	IN id_carteirae INT
)
AS $$
DECLARE
	verif INT;
BEGIN
	SELECT id
	INTO verif
	FROM carteiras
	WHERE id = id_carteirae;

	IF NOT FOUND THEN
		RAISE EXCEPTION 'carteira com o id % não existe', id_carteirae;
	ELSE
		BEGIN
			DELETE FROM entradas
			WHERE carteira_alvo = id_carteirae;

			DELETE FROM saidas
			WHERE carteira_alvo = id_carteirae;

			DELETE FROM carteiras
			WHERE id = id_carteirae;
		END;
	END IF;

END;
$$ LANGUAGE PLPGSQL;

-------------CD DOS FORASTEIROS-------------

/*forasteiro aponta para aquele usuário que o criou*/
CREATE OR REPLACE PROCEDURE adicionar_forasteiro
(
	IN nome_inp VARCHAR(50),
	IN descr_inp TEXT,
	IN prop_registr INT
)
AS $$
	INSERT INTO forasteiros( nome, descr, proprietario_registro )
	VALUES ( nome_inp, descr_inp, prop_registr );
$$ LANGUAGE SQL;

CREATE OR REPLACE PROCEDURE deletar_forasteiro
(
	IN nome_inp VARCHAR(50)
)
AS $$
DECLARE
	verif INT;
BEGIN
	SELECT id
	INTO verif
	FROM forasteiros
	WHERE nome = nome_inp;

	IF NOT FOUND THEN
		RAISE EXCEPTION 'Forasteiro de nome % não existe', nome_inp;
	ELSE
		BEGIN
			DELETE FROM forasteiros
			WHERE id = verif;

			DELETE FROM entradas
			WHERE pagador = verif;

			DELETE FROM saidas
			WHERE recebedor = verif;
		END;
	END IF;
END;
$$ LANGUAGE PLPGSQL;

------------ENTRADAS SAIDAS--------------

CREATE OR REPLACE PROCEDURE adicionar_entrada
(
	IN descr_inp TEXT,
	IN quantia_inp FLOAT,
	IN pagador_inp INT,
	IN recebedor_inp INT,
	IN cart_alvo_inp INT
)
LANGUAGE SQL
AS $$
	INSERT INTO entradas( descr, quantia, pagador, recebedor, carteira_alvo )
	VALUES ( descr_inp, quantia_inp, pagador_inp, recebedor_inp, cart_alvo_inp );
$$;

CREATE OR REPLACE PROCEDURE adicionar_saida
(
	IN descr_inp TEXT,
	IN quantia_inp FLOAT,
	IN pagador_inp INT,
	IN recebedor_inp INT,
	IN cart_alvo_inp INT
)
LANGUAGE SQL
AS $$
	INSERT INTO saidas( descr, quantia, pagador, recebedor, carteira_alvo )
	VALUES ( descr_inp, quantia_inp, pagador_inp, recebedor_inp, cart_alvo_inp );
$$;
