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
	recebedor INT REFERENCES usuarios ( id )
);

CREATE TABLE IF NOT EXISTS saidas
(
	data_hora VARCHAR(30) NOT NULL,
	descr TEXT,
	quantia FLOAT NOT NULL,
	recebedor INT REFERENCES usuarios ( id ),
	pagador INT REFERENCES forasteiros ( id )
);

/* FUNÇÕES PARA ACESSO A INFORMAÇÕES */

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

/*PROCEDIMENTOS PARA INSERÇÕES*/

/*GATILHOS PARA MODIFICAÇÕES EM CADEIA*/


