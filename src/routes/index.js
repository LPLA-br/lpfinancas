const express = require('express');
const router = express.Router();
//const session = require( 'express-session' );
const path = require('path');
const { Pool } = require('pg');

const { dbcredenciais } = require( '../config/credenciais' );

router.get('/', (req, res, next)=>
{
	res.render( 'index', {} );
});

router.get( '/criarconta', (req,res,next)=>
{
	res.render( 'criarconta', {});
});

router.post( '/criarconta', (req,res,next)=>
{
	const login = req.body.login;
	const senha = req.body.senha;

	const postgres = new Pool( dbcredenciais );

	//usuário já existe ?
	postgres.query( "SELECT consulta_login_usuario($1::text)", [ login ], ( erro, resultado )=>
	{
		if ( erro )
		{
			console.log( 'criarconta consulta de verificação\n' + erro );
		}
		else if ( resultado.rows.length == 0 )
		{
			//criar nova conta
			const sub = new Pool( dbcredenciais );

			sub.query( 'insert into usuarios(login,senha) values ($1,$2)', [login,senha] )
			.then( ( resposta ) =>
			{
				console.log( resposta.command );
				res.render( 'criou', { msg: `ola ${login}`, sucesso: true } );
			})
			.catch( ( erro ) =>
			{
				const texto = `ops! um erro interno não possibilitou a criação da conta`;
				console.log('ta pegando fogo bixo!!!', erro.stack )
				res.render( 'criou', { msg: texto, sucesso: false } );
			});

			sub.end().then( console.log( 'fim /criarconta inserção' ) );
		}
		else
		{
			const texto = `Ops! há outro usuário com este login! tente novamente`;
			res.render( 'criou', { msg: texto, sucesso: false } );
		}
	});


	postgres.end().then( () => console.log('FIM /CRIARCONTA') );
});

router.get( '/login', (req,res,next)=>
{
	res.render( 'login', {} );
});

router.post( '/login', (req,res,next)=>
{
	const login = req.body.login;
	const senha = req.body.senha;

	const { Pool } = require('pg');
	const postgres = new Pool( dbcredenciais );

	postgres.query( "SELECT consulta_usuario( $1::text, $2::text )", [ login, senha ], ( erro, resultado )=>
	{
		if ( erro )
		{
			console.log( erro );
		}
		else if ( resultado.rows.length == 0 )
		{
			console.log( `${login} não existe ou sua senha esta errada.` );

			res.statusCode = 404;
			res.render( 'criou', { msg:'senha ou login errado!', sucesso: true } );
		}
		else
		{
			res.sendStatus = 202;
			console.log( 'POST ' + login + ' LOGADO !' );
			res.redirect( `/sessao/${login}/` );
		}
	});

	postgres.end().then( ()=>{ console.log( 'FIM /LOGIN' ) } );
});

// --- aplicação ---
/* req.params.usuario -> :usuario */

router.get('/sessao/:usuario/', (req,res,next)=>
{
	res.render('sessao', { usuario: req.params.usuario });
});

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

router.get( '/sessao/:usuario/entradas', (req,res,next)=>
{
	res.render( 'sessao', { usuario: req.params.usuario });
});

router.get( '/sessao/:usuario/saidas', (req,res,next)=>
{
	res.render( 'sessao', { usuario: req.params.usuario });
});

router.get( '/sessao/:usuario/sair', ()=>{} );

module.exports = router;
