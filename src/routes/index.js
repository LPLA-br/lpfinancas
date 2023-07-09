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

	if ( login == undefined && senha == undefined )
	{
		res.render( 'criou', { msg: "undefined login ou senha", sucesso: false } );
	}

	( async ()=>
	{
		try
		{
			let perm = true;

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

			if ( perm == true )
			{
				let m = `Usuario ${ login ?? "Erro" } foi criado com sucesso`;
				res.render( 'criou', { msg: m, sucesso: true } );
			}
			else
			{
				let m = `Erro: O login informado não esta disponível para uso. Tente novamente`;
				res.render( 'criou', { msg: m, sucesso: false } );
			}
		}
		catch ( erro )
		{
			console.log( "\n\n\n" ,erro );
		}
	})();

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
			
			await seq.close();

			if ( results.login == login && results.senha == senha )
			{
				//criar id hexadecimal no banco de dados mongo
				( async ()=>
				{
					await mongoose.connect( uri );

					// middleware
					let h = '';
					for( let a = 0; a < 16; a++ )
					{
						h = h + await hexGen();
					}

					/* verificar se id existe antes
					 * de inserir um novo id no ato
					 * de repetição de login*/

					const mresults = await Token.findOne( { login: login } );

					if ( mresults.$isEmpty() )
					{
						const instancia = new Token( { login: login, hexid: h } );
						await instancia.save();
					}

					await mongoose.disconnect();

				}
				)();

				res.redirect( `/sessao/${login}/${hexid}/` );
			}
			else
			{
				let m = "login ou senha incorreto(s) !";
				res.render( 'mensagem', { titulo: "ERRO", mensagem: m, logado: false } );
			}

		}
		catch ( erro )
		{
			console.log( "erro" );
		}
	})();

});

// APLICAÇÃO POST LOGIN ----

router.get('/sessao/:usuario/:hexid/', (req,res,next)=>
{
	res.render( 'sessao', { usuario: req.params.usuario, hexid: req.params.hexid } );
});

router.get( '/sessao/:usuario/:hexid/sair', (req,res,next)=>
{
	//deletar id hexadecimal no banco de dados
	( async ()=>
	{
		await mongoose.connect( uri );

		const mresults = await Token.findOne( { login: login } );

		if ( mresults.$isEmpty() )
		{

		}
		else
		{
			await Token.deleteOne( { login: login } );
		}

		await mongoose.disconnect();

	}
	)();


	res.redirect( '/' );
});


module.exports = router;
