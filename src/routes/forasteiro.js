const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

router.get( '/sessao/:usuario/adicionarforasteiro', (req,res,next)=>
{
	res.render('adicionarforasteiro', { usuario: req.params.usuario });
});

router.post( '/sessao/:usuario/adicionarforasteiro', (req,res,next)=>
{

	const { nome } = req.body;
	const { descricao } = req.body;

	const bd = new Pool( dbcredenciais );

	bd.query( 'CALL adicionar_forasteiro( $1, $2, consulta_id_usuario( $3 ) )', [ nome, descricao, req.params.usuario ] )
	.then( ( resposta ) =>
	{
		console.log( resposta.command );
		const texto = `forasteiro ${req.body.nome ?? 'undefined'} foi adicionado`;
		res.render( 'mensagem', { usuario: req.params.usuario, mensagem: texto, titulo: 'SALVO' } );
	})
	.catch( ( erro ) =>
	{
		const texto = `ops! um erro interno não possibilitou a adição de um forasteiro`;
		console.log('ta pegando fogo bixo!!!', erro.stack );
		res.render( 'mensagem', { usuario: req.params.usuario, mensagem: texto, titulo: 'ERRO' } );
	});

	bd.end().then( console.log( 'fim /adicionarforasteiro inserção' ) );
});

router.get( '/sessao/:usuario/editarforasteiro', (req,res,next)=>
{
	res.render( 'sessao', { usuario: req.params.usuario });
});

router.get( '/sessao/:usuario/visualizarforasteiros', (req,res,next)=>
{
	res.render( 'sessao', { usuario: req.params.usuario });
});

router.get( '/sessao/:usuario/deletarforasteiro', (req,res,next)=>
{
	res.render( 'sessao', { usuario: req.params.usuario });
});

module.exports = router;
