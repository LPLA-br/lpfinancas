const express = require('express');
const router = express.Router();
const { seq } = require( '../models/modelos' );
const { Usuario } = require( '../models/modelos' );

const intraex = require('./intra-ex');
const carteiras = require('./carteiras');
const forasteiro = require('./forasteiro');

router.use( intraex );
router.use( carteiras );
router.use( forasteiro );

router.get('/', (req, res, next)=>
{
	res.render( 'index', {} );
});

router.get( '/criarconta', (req,res,next)=>
{
	res.render( 'criarconta', {} );
});

router.get( '/login', (req,res,next)=>
{
	res.render( 'login', {} );
});

// SQL ----

router.post( '/criarconta', (req,res,next)=>
{
	const login = req.body.login ?? undefined;
	const senha = req.body.senha ?? undefined;

	if ( login == undefined && senha == undefined )
	{
		res.render( 'criou', { msg: "undefined login ou senha", sucesso: false } );
	}

	( async ()=>
	{
		try
		{
			await seq.authenticate();
			//const novo = Usuario.build( { login: login, senha: senha } );

			const results = await Usuario.findOne( { where: { login: login, senha: senha } } );

			console.log( JSON.stringify( results ) );
			
			//await novo.save();

			await seq.close();

		}
		catch( erro )
		{
			console.log( "\n\n\n" ,erro );
		}
	})();
	res.render( 'criou', { msg: "criado", sucesso: true } );
});

router.post( '/login', (req,res,next)=>
{

});

// APLICAÇÃO ----
/* req.params.usuario -> :usuario */

router.get('/sessao/:usuario/', (req,res,next)=>
{
	res.render( 'sessao', { usuario: req.params.usuario } );
});

router.get( '/sessao/:usuario/sair', (req,res,next)=>
{
	res.redirect( '/' );
});


module.exports = router;
