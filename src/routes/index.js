const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { seq } = require( '../models/modelos' );
const { Usuario } = require( '../models/modelos' );

const { Token, uri } = require( '../models/sessao' );
const { MongoClient, ServerApiVersion } = require( 'mongodb' ); //gambiarra

//models
const intraex = require('./intra-ex');
const carteiras = require('./carteiras');
const forasteiro = require('./forasteiro');

//controllers
const indicis = require( '../controllers/indicis' );

//middlewares
const { hexGen } = require( '../middlewares/' );

router.use( intraex );
router.use( carteiras );
router.use( forasteiro );

async function salvarHexidParaLogin( login )
{
	try
	{
		let h = '';

		for( let a = 0; a < 16; a++ )
		{
			h = h + await hexGen();
		}

		await mongoose.connect( uri );


		/* verificar se id existe antes
		 * de inserir um novo id no ato
		 * de repetição de login*/

		const mresults = await Token.findOne( { login: login } );

		if ( mresults?.login == undefined )
		{
			const instancia = new Token( { login: login, hexid: h } );
			await instancia.save();
		}

		await mongoose.disconnect();
		return h;
	}
	catch ( erro )
	{
		console.log( erro );
		return undefined;
	}
}

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

router.post( '/criarconta', indicis.criarconta );

router.post( '/login', indicis.login );

// APLICAÇÃO POST LOGIN ----

router.get('/sessao/:usuario/:hexid/', (req,res,next)=>
{
	res.render( 'sessao', { usuario: req.params.usuario, hexid: req.params.hexid } );
});

router.get( '/sessao/:usuario/:hexid/sair', indicis.sair );

module.exports = router;
