const express = require('express');
const router = express.Router();
//const session = require( 'express-session' );
const path = require('path');
const { Pool } = require('pg');

//const { dbcredenciais } = require( '../config/credenciais' );
const { dbcredenciais } = require( '../config/credenciais_localdev' );

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

	const add = new Pool( dbcredenciais );

	add.query( 'CALL adicionar_forasteiro( $1, $2, consulta_id_usuario( $3 ) )', [ nome, descricao, req.params.usuario ] )
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

	add.end().then( console.log( 'fim /adicionarforasteiro inserção' ) );
});

router.get( '/sessao/:usuario/criarcarteira', (req,res,next)=>
{
	res.render( 'criarcarteira', { usuario: req.params.usuario } );
});

router.post( '/sessao/:usuario/criarcarteira', (req,res,next)=>
{
	res.render( 'mensagem', { usuario: req.params.usuario, titulo: 'em progresso', texto: 'em progresso' } );
});

router.get( '/sessao/:usuario/visualizarcarteira', (req,res,next)=>
{
	res.render( 'visualizarcarteira', { usuario: req.params.usuario } );
});

router.get( '/sessao/:usuario/visualizarforasteiros', (req,res,next)=>
{
	res.render( 'visualizarforasteiro', { usuario: req.params.usuario } );
});



router.get( '/sessao/:usuario/sair', ()=>{} );

module.exports = router;
