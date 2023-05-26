-- Banco de dados para Aplicação
-- Financeira pessoal.
-- Luiz Paulo L. A.

CREATE DATABASE IF NOT EXISTS LPFINANCAS;
USE LPFINANCAS;

CREATE TABLE IF NOT EXISTS Reserva(
	Propiet INT UNSIGNED,
	Nome VARCHAR(50),
	Motante NUMERIC(10,2),
	PRIMARY KEY (Propiet)
);

CREATE TABLE IF NOT EXISTS IndividuoExterno(
	Id INT UNSIGNED AUTO_INCREMENT,
	Nome VARCHAR(50),
	Descr VARCHAR(500),
	PRIMARY KEY (Id)
);

--Saida de capital da reserva.
CREATE TABLE IF NOT EXISTS Saida(
	Id INT UNSIGNED AUTO_INCREMENT,
	Quantia INT UNSIGNED,
	Data VARCHAR(20),
	Descr VARCHAR(500),
	PropPagador INT UNSIGNED,
	IndivReceb INT UNSIGNED,
	PRIMARY KEY(Id),
	FOREIGN KEY (PropPagador) REFERENCES Reserva(Propiet),
	FOREIGN KEY (IndivReceb) REFERENCES IndividuoExterno(Id)
);

--entrada de capital na reserva.
CREATE TABLE IF NOT EXISTS Entrada(
	Id INT UNSIGNED AUTO_INCREMENT,
	Quantia INT UNSIGNED,
	Data VARCHAR(20),
	Descr VARCHAR(500),
	PropReceb INT UNSIGNED,
	IndivPagador INT UNSIGNED,
	PRIMARY KEY(Id),
	FOREIGN KEY (PropReceb) REFERENCES Reserva(Propiet),
	FOREIGN KEY (IndivPagador) REFERENCES IndividuoExterno(Id)
);

