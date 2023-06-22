/*################# GATILHOS ##################*/

/*
	As datas das entradas e saidas são
	automaticamente inseridas pelo banco de dados.
*/

CREATE OR REPLACE FUNCTION data_atual( IN  INT )
RETURNS TRIGGER AS $data_atual$
BEGIN
	IF alvo = 1 THEN
		UPDATE entradas
		SET NEW.data_hora = NOW()
		WHERE id = NEW.id;
	ELSE
		UPDATE saidas
		SET NEW.data_hora = NOW()
		WHERE id = NEW.id;
	END IF;

END
$data_atual$ LANGUAGE PLPGSQL;

CREATE OR REPLACE TRIGGER atualizar_data_entradas
BEFORE
INSERT
ON entradas
EXECUTE FUNCTION atualizar_data_entradas(1);

CREATE OR REPLACE TRIGGER atualizar_data_saidas
BEFORE
INSERT
ON saidas
EXECUTE FUNCTION atualizar_valor_carteira(0);

DROP TRIGGER IF EXISTS atualizar_entrada;
DROP FUNCTION IF EXISTS atualizar_valor_carteira;

