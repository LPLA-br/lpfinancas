/*************************************
 * AUTOR: Luiz Paulo de Lima Araújo
 * DATA INICIAL: 25 de Maio de 2022
 * PROJETO: lpfinancas
 * CATEGORIA: tabelas
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

