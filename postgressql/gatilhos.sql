/*################# GATILHOS ##################*/

 /*updates ou inserts de entrada e de saida
  corrigem o valor de uma
  respectiva carteira*/

CREATE OR REPLACE FUNCTION atualizar_valor_carteira()
RETURNS TRIGGER AS $atualizar_valor_carteira$
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


