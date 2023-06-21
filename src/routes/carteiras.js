const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

router.get( '/sessao/:usuario/criarcarteira', (req,res,next)=>
{
	res.render( 'criarcarteira', { usuario: req.params.usuario } );
});

router.post( '/sessao/:usuario/criarcarteira', (req,res,next)=>
{
	const bd = new Pool( dbcredenciais );

	const { unidademonetaria } = req.body;
	const { motanteinicial } = req.body;

	bd.query( 'CALL adicionar_carteira( $1, $2, consulta_id_usuario( $3 ) )', [ unidademonetaria, motanteinicial, req.params.usuario ] )
	.then( ( resposta ) =>
	{
		const texto = `carteira de unidade monetária ${unidademonetaria} foi criada`;
		res.render( 'mensagem', { usuario: req.params.usuario, mensagem: texto, titulo:'CRIADO' } );
	})
	.catch( ( erro ) =>
	{
		const texto = `um erro interno não possibilitou a criação da carteira.`;
		console.log('ta pegando fogo bixo!!!', erro.stack );
		res.render( 'mensagem', { usuario: req.params.usuario, mensagem: texto, titulo:'ERRO' } );
	});

	bd.end().then( console.log( 'fim /criarcarteira inserção' ) );
});

router.get( '/sessao/:usuario/editarcarteira', (req,res,next)=>
{
	res.render( 'sessao', { usuario: req.params.usuario });
});

router.get( '/sessao/:usuario/visualizarcarteira', (req,res,next)=>
{
	//consulta para redenização das carteiras.
	const bd = new Pool( dbcredenciais );
	const consulta =
	{
		text: 'SELECT * FROM carteiras WHERE proprietario = consulta_id_usuario( $1 );',
		values: [ req.params.usuario ],
	};

	bd.query( consulta )
	.then( ( resposta ) =>
	{
		res.render( 'visualizarcarteira', { usuario: req.params.usuario, dados: resposta.rows } );
	})
	.catch( ( erro ) =>
	{
		const texto = `um erro interno não possibilitou a geração da lista de carteiras`;
		res.render( 'mensagem', { usuario: req.params.usuario, mensagem: texto, titulo: 'ERRO' } );
		console.log('ta pegando fogo bixo!!!', erro.stack );
	});

	bd.end().then( console.log( 'fim /listarcarteiras -> visualizarcarteira' ) );
});

router.post( '/sessao/:usuario/visualizarcarteira', (req,res,next)=>
{
	const bd = new Pool( dbcredenciais );
	const { carteiras } = req.body;
	const consulta =
	{
		text: 'SELECT * FROM carteiras WHERE proprietario = consulta_id_usuario( $1 ) AND id = $2;',
		values: [ req.params.usuario, carteiras ],
	};

	bd.query( consulta )
	.then( ( resposta ) =>
	{
		res.render( 'visualizarcarteiradados', { usuario: req.params.usuario, dados: resposta.rows } );
	})
	.catch( ( erro ) =>
	{
		const texto = `um erro interno não possibilitou a geração da tabela que detalha a carteira`;
		res.render( 'mensagem', { usuario: req.params.usuario, mensagem: texto, titulo: 'ERRO' } );
		console.log('ta pegando fogo bixo!!!', erro.stack );
	});

	bd.end().then( console.log( 'fim /visualizarcarteiradados' ) );
});

router.get( '/sessao/:usuario/deletarcarteira', (req,res,next)=>
{
	res.render( 'sessao', { usuario: req.params.usuario });
});

module.exports = router;
