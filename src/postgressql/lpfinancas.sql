/*************************************
 * AUTOR: Luiz Paulo de Lima Araújo
 * DATA: 25 de Maio de 2022
 * PROJETO: lpfinancas
 *
 **************************************/

CREATE TABLE IF NOT EXISTS usuarios
(
	id SERIAL,
	login VARCHAR(20) NOT NULL,
	senha VARCHAR(50) NOT NULL,
	PRIMARY KEY( id )
);

CREATE TABLE IF NOT EXISTS carteiras
(
	id SERIAL PRIMARY KEY,
	unidade_monetaria CHAR(3) NOT NULL,
	motante FLOAT NOT NULL,
	proprietario INT REFERENCES usuarios ( id )
);

CREATE TABLE IF NOT EXISTS forasteiros
(
	id SERIAL PRIMARY KEY,
	nome VARCHAR(50) NOT NULL,
	descr TEXT,
	proprietario_registro INT REFERENCES usuarios( id )
);

CREATE TABLE IF NOT EXISTS entradas
(
	data_hora VARCHAR(30) NOT NULL,
	descr TEXT,
	quantia FLOAT NOT NULL,
	pagador INT REFERENCES forasteiros ( id ),
	recebedor INT REFERENCES usuarios ( id ),
	carteira_alvo INT REFERENCES carteiras ( id )
);

CREATE TABLE IF NOT EXISTS saidas
(
	data_hora VARCHAR(30) NOT NULL,
	descr TEXT,
	quantia FLOAT NOT NULL,
	recebedor INT REFERENCES usuarios ( id ),
	pagador INT REFERENCES forasteiros ( id ),
	carteira_alvo INT REFERENCES carteiras ( id )
);

/* --ALTERAÇÕES NAS TABELAS 'LOG'-- */
-- NOTA: após criação das tabelas iniciais acima.

ALTER TABLE entradas
ADD COLUMN IF NOT EXISTS 
carteira_alvo INT REFERENCES carteiras( id );

ALTER TABLE saidas
ADD COLUMN IF NOT EXISTS
carteira_alvo INT REFERENCES carteiras( id );

/*################# FUNÇÕES ##################*/

/* retorna um ou nenhum usuário do banco de dados. */
CREATE OR REPLACE FUNCTION consulta_usuario( user_login VARCHAR(20), usuario_senha VARCHAR(50) )
RETURNS TABLE( login VARCHAR(20), senha VARCHAR(50) ) AS $$
	SELECT login, senha
	FROM usuarios
	WHERE login = user_login AND senha = usuario_senha;
$$
LANGUAGE SQL;

CREATE OR REPLACE FUNCTION consulta_login_usuario( user_login VARCHAR(20) )
RETURNS TABLE( login VARCHAR(20) ) AS $$
	SELECT login
	FROM usuarios
	WHERE login = user_login;
$$
LANGUAGE SQL;

/*################# PROCEDIMENTOS ##################*/

CREATE OR REPLACE PROCEDURE criar_conta_usuario( login_inp VARCHAR(20), senha_inp VARCHAR(50) )
AS $$
BEGIN
	IF senha_inp IS NULL THEN
		RAISE EXCEPTION 'não pode haver usuários sem senha neste sistema !!!';
	ELSE IF login_inp IS NULL THEN
		RAISE EXCEPTION 'não pode haver usuários sem login neste sistema !!!';
	END IF;

	INSERT INTO usuarios( login, senha )
	VALUES ( login_inp, senha_inp );
END
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE PROCEDURE adicionar_carteira( unidade_monetaria_inp CHAR(3), motante_inp FLOAT, proprietario_inp INT )
LANGUAGE SQL
AS $$
	INSERT INTO carteiras( unidade_monetaria, motante, proprietario )
	VALUES( unidade_monetaria_inp, motante_inp, proprietario_inp );
$$;


CREATE OR REPLACE PROCEDURE adicionar_forasteiro( nome_inp VARCHAR(50), descr_inp TEXT, prop_registr INT )
LANGUAGE SQL
AS $$
	INSERT INTO forasteiros( nome, descr, proprietario_registro )
	VALUES ( nome_inp, descr_inp, prop_registr );
$$;

-------------------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE adicionar_entrada
(
	descr_inp TEXT,
	quantia_inp FLOAT,
	pagador_inp INT,
	recebedor_inp INT,
	cart_alvo_inp INT
)
LANGUAGE SQL
AS $$
	INSERT INTO entradas( descr, quantia, pagador, recebedor, carteira_alvo )
	VALUES ( descr_inp, quantia_inp, pagador_inp, recebedor_inp, cart_alvo_inp );
$$;

CREATE OR REPLACE PROCEDURE adicionar_saida
(
	descr_inp TEXT,
	quantia_inp FLOAT,
	pagador_inp INT,
	recebedor_inp INT,
	cart_alvo_inp INT
)
LANGUAGE SQL
AS $$
	INSERT INTO saidas( descr, quantia, pagador, recebedor, carteira_alvo )
	VALUES ( descr_inp, quantia_inp, pagador_inp, recebedor_inp, cart_alvo_inp );
$$;
-------------------------------------------------------------------------------------------

/*################# GATILHOS ##################*/

 /*updates ou inserts de entrada e de saida
  corrigem o valor de uma
  respectiva carteira*/

CREATE OR REPLACE FUNCTION atualizar_valor_carteira()
RETURNS trigger AS $atualizar_valor_carteira$
BEGIN
	UPDATE carteiras
	SET motante = motante + NEW.quantia
	WHERE id = NEW.carteira_alvo;
END
$atualizar_valor_carteira$ LANGUAGE PLPGSQL;

CREATE OR REPLACE TRIGGER atualizar_entrada
BEFORE INSERT OR UPDATE ON entradas
EXECUTE FUNCTION atualizar_valor_carteira();


/*################# VIEWS ##################*/


