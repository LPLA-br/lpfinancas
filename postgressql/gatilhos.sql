/*################# GATILHOS ##################*/

/*
	As datas das entradas e saidas são
	automaticamente inseridas pelo banco de dados.
*/

CREATE OR REPLACE FUNCTION data_atual_entrada()
RETURNS TRIGGER AS $data_atual_entrada$
BEGIN
	UPDATE entradas
	SET NEW.data_hora = NOW()
	WHERE id = NEW.id;
END
$data_atual_entrada$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION data_atual_saida()
RETURNS TRIGGER AS $data_atual_saida$
BEGIN
	UPDATE saidas
	SET NEW.data_hora = NOW()
	WHERE id = NEW.id;
END
$data_atual_saida$ LANGUAGE PLPGSQL;

CREATE OR REPLACE TRIGGER atualizar_data_entradas
BEFORE
INSERT
ON entradas
EXECUTE FUNCTION data_atual_entrada();

CREATE OR REPLACE TRIGGER atualizar_data_saidas
BEFORE
INSERT
ON saidas
EXECUTE FUNCTION data_atual_saida();
