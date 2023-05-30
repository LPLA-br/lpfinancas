#!/bin/sh

USUARIO='lpfinancas';
BANCODADOS='lpf';
TABELAS='./lpfinancas.sql';

createuser -d -l -g -U $USUARIO ;
createdb -O $USUARIO $BANCODADOS;
psql -U $USUARIO -d $BANCODADOS < $TABELAS;
echo "configuração concluida. timestamp: $(date +%s)";
