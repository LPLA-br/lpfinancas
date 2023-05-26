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
	descr TEXT
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

/*PROCEDIMENTOS PARA INSERÇÕES*/

/*GATILHOS PARA MODIFICAÇÕES EM CADEIA*/


