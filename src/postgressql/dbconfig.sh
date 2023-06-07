#!/bin/sh

USUARIO='lpfinancas';
BANCODADOS='lpf';
TABELAS='./lpfinancas.sql';
PROPRIETARIO='postgres';
HOSTNAMEDB='pgdb';
DEVSENHA='mo69om';
PORTA="5432";
DADOSCOTEINERIS='/var/lib/postgresql/data/pgdata';

if [[ $1 == "-l" ]]; then

	createuser -d -l -g -U $USUARIO ;
	createdb -O $USUARIO $BANCODADOS ;
	psql -U $USUARIO -d $BANCODADOS < $TABELAS ;
	echo "configuração concluida. timestamp: $(date +%s)" ;

elif [[ $1 == "-c" ]]; then

	if [[  $(docker container ls -a | grep $HOSTNAMEDB | wc -l) == '1' ]]; then
		echo 'pgdb existe! PULANDO' ;
	else
		echo 'pgdb não existe. CRIANDO...';
		docker run --detach --publish 5432:5432 --name pgdb --volume lpfinancas:$DADOSCOTEINERIS --network lpfinancas --env POSTGRES_PASSWORD=$DEVSENHA postgres ;
	fi

elif [[ $1 == "--popular" ]]; then

	HOST=$(docker container inspect pgdb | grep IPAddress | sed '1,2d' | cut -d ':' -f 2 | tr -d '"' | tr -d ' ' | tr -d ',');
	createdb --host=$HOST --port=$PORTA -U $PROPRIETARIO --owner=$PROPRIETARIO $BANCODADOS;
	psql --host=$HOST --port=$PORTA -U $PROPRIETARIO -d $BANCODADOS < $TABELAS;

fi

