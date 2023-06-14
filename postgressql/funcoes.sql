/*################# FUNÇÕES ##################*/

/* retorna um ou nenhum usuário do banco de dados. */
CREATE OR REPLACE FUNCTION consulta_usuario
(
	IN user_login VARCHAR(20),
	IN usuario_senha VARCHAR(50)
)
RETURNS TABLE( login VARCHAR(20), senha VARCHAR(50) )
AS $$
	SELECT login, senha
	FROM usuarios
	WHERE login = user_login AND senha = usuario_senha;
$$
LANGUAGE SQL;

/* retorna login do usuário ou nada */
CREATE OR REPLACE FUNCTION consulta_login_usuario
(
	IN user_login VARCHAR(20)
)
RETURNS TABLE( login VARCHAR(20) )
AS $$
	SELECT login
	FROM usuarios
	WHERE login = user_login;
$$
LANGUAGE SQL;

CREATE OR REPLACE FUNCTION consulta_id_usuario
(
	IN login_inp VARCHAR(20)
)
RETURNS INT
AS $$
	SELECT id
	FROM usuarios
	WHERE login = login_inp;
$$ LANGUAGE SQL;

--carteiras

CREATE OR REPLACE FUNCTION lista_de_carteiras_do_usuario
(
	IN id_usuarii INT
)
RETURNS TABLE ( id INT, unidade_monetaria CHAR(3), motante FLOAT )
AS
$$
	SELECT id, unidade_monetaria, motante
	FROM carteiras
	WHERE proprietario = id_usuarii;
$$ LANGUAGE SQL;
