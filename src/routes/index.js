const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { seq } = require( '../models/modelos' );
const { Usuario } = require( '../models/modelos' );

const { Token, uri } = require( '../models/sessao' );

const intraex = require('./intra-ex');
const carteiras = require('./carteiras');
const forasteiro = require('./forasteiro');

router.use( intraex );
router.use( carteiras );
router.use( forasteiro );

async function hexGen()
{
	const nums = [ '0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f' ];
	const min = 0;
	const max = 15;

	return nums[ Math.floor( Math.random() * ( max - min + 1 ) + min ) ];
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

router.post( '/criarconta', (req,res,next)=>
{
	const login = req.body.login ?? undefined;
	const senha = req.body.senha ?? undefined;
	let perm = true;

	if ( login == undefined && senha == undefined )
	{
		res.render( 'criou', { msg: "undefined login ou senha", sucesso: false } );
	}

	( async ()=>
	{
		try
		{
			await seq.authenticate();

			const results = await Usuario.findOne( { where: { login: login, senha: senha } } );
			
			if ( results.login == login )
			{
				perm = false;
			}
			else
			{
				const novo = Usuario.build( { login: login, senha: senha } );
				await novo.save();
			}

			await seq.close();
		}
		catch ( erro )
		{
			console.log( "\n\n\n" ,erro );
		}
	})();

	if ( perm == true )
		res.render( 'criou', { msg: "criado", sucesso: true } );
	else
		res.render( 'criou', { msg: "Erro Existe um usuario com o login passado.", sucesso: false } );
});

router.post( '/login', (req,res,next)=>
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

			const results = await Usuario.findOne( { where: { login: login, senha: senha } } );
			
			if ( results.login == login && results.senha == senha )
			{
				//criar id hexadecimal no banco de dados
				( async ()=>
				{
					await mongoose.connect( uri );

					let h = '';
					for( let a = 0; a < 16; a++ )
					{
						h = h + await hexGen();
					}

					/* verificar se id existe antes
					 * de inserir um novo id no ato de login*/

					const mresults = await Token.findOne( { login: login } );

					if ( mresults.$isEmpty() )
					{
						const instancia = new Token( { login: login, hexid: h } );
						await instancia.save();
					}

					await mongoose.disconnect();

				}
				)();
			}

			await seq.close();
		}
		catch ( erro )
		{
			console.log( "erro" );
		}
	})();
	res.send( 'ok' );
});

// APLICAÇÃO ----
/* req.params.usuario -> :usuario */

router.get('/sessao/:usuario/', (req,res,next)=>
{
	res.render( 'sessao', { usuario: req.params.usuario } );
});

router.get( '/sessao/:usuario/sair', (req,res,next)=>
{
	//deletar id hexadecimal no banco de dados


	res.redirect( '/' );
});


module.exports = router;
