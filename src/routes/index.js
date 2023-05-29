const express = require('express');
const router = express.Router();
//const session = require( 'express-session' );
const path = require('path');

const { dbcredenciais } = require( '../postgressql/credenciais' );

router.get('/', (req, res, next)=>
{
	res.sendFile( path.join( __dirname, '../public/index.html' ) );
});

router.get( '/criarconta', (req,res,next)=>
{
	res.render( 'criarconta', {});
});

router.post( '/criarconta', (req,res,next)=>
{
	const login = req.body.login;
	const senha = req.body.senha;

	const { Pool } = require('pg');
	const postgres = new Pool( dbcredenciais );

	//usuário já existe ?
	postgres.query( 'SELECT consulta_login_usuario( $1 )', [ login ], ( erro, resultado )=>
	{
		if ( erro )
		{
			console.log( 'criarconta consulta de verificação\n' + erro );
		}
		else if ( resultado.rows.length != 0 )
		{
			console.log( JSON.stringify( resultado.fields ) );
			console.log( JSON.stringify( resultado.rows ) );

			const texto = `Ops! há outro usuário com este login! tente novamente`;
			res.render( 'criou', { msg: texto, sucesso: false } );
		}
		else
		{
			const sub = new Pool( dbcredenciais );

			sub.query( 'INSERT INTO usuarios(login,senha) VALUES ($1,$2)', [login,senha] )
			.then( ( resposta ) =>
			{
				console.log( JSON.stringify( resposta.rows ) );
				res.render( 'criou', { msg: `Ola ${login}`, sucesso: true } );
			})
			.catch( ( erro ) =>
			{
				const texto = `Ops! um erro interno não possibilitou a criação da conta`;
				console.log('TA PEGANDO FOGO BIXO!!!', erro.stack )
				res.render( 'criou', { msg: texto, sucesso: false } );
			});

			sub.end().then( console.log( 'FIM /CRIARCONTA subconsulta' ) );
		}
		
		console.log( JSON.stringify( resultado ) );

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

	//verificar se a query retorna um usuário.
	postgres.query( 'SELECT consulta_usuario( $1::text, $2::text )', [ login, senha ], ( erro, resultado )=>
	{
		if ( erro )
		{
			console.log( erro );
		}
		else if ( resultado.rows.length == 0 )
		{
			res.statusCode = 404;
			console.log( `POST ${login} não existe ou sua senha esta errada.` );
			res.render( 'criou', { msg:'senha ou login errado!', sucesso: true } );
		}
		else
		{
			res.sendStatus = 202;
			console.log( 'POST ' + login + ' LOGADO !' );
			res.render( 'sessao', { login } );
		}
	});

	postgres.end().then( ()=>{ console.log( 'FIM /LOGIN' ) } );
});

module.exports = router;
