const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { seq } = require( '../models/modelos' );
const { Forasteiro } = require( '../models/modelos' );

const { Token, uri } = require( '../models/sessao' );
const { MongoClient, ServerApiVersion } = require( 'mongodb' ); //gambiarra

const { databases } = require( '../config/config' );

async function verificarHexid( login, hexid )
{
	await mongoose.connect( uri );
	const mresults = await Token.findOne( { login: login, hexid: hexid } );
	await mongoose.disconnect();

	if ( mresults?.login == undefined )
	{
		return false;
	}
	else
	{
		return true;
	}
}

router.get( '/sessao/:usuario/:hexid/adicionarforasteiro', (req,res,next)=>
{
	/* databases.servidor = Endereço ip para requisições advindas de páginas
	dinâmicamente rederizadas. */
	const dados =
	{
		usuario: req.params.usuario,
		hexid: req.params.usuario,
		servidor: databases.servidor
	};
	res.render('adicionarforasteiro', dados );
});

router.get( '/sessao/:usuario/:hexid/editarforasteiro', (req,res,next)=>
{
	res.send( "<h1> NADA </h1>" );
});

router.get( '/sessao/:usuario/:hexid/visualizarforasteiros', (req,res,next)=>
{
	res.send( "<h1> NADA </h1>" );
});

router.get( '/sessao/:usuario/:hexid/deletarforasteiro', (req,res,next)=>
{
	res.send( "<h1> NADA </h1>" );
});

router.post( '/sessao/:usuario/:hexid/adicionarforasteiro', (req,res,next)=>
{
	//criar forasteiro
	const dados =
	{
		usuario: req.params.usuario,
		hexid: req.params.usuario,
		servidor: databases.servidor,
		nome: req.body.nome,
		descricao: req.body.nome
	};

	( async ()=>
	{
		const permissao = await verificarHexid( dados.usuario, dados.hexid );
		if ( permissao == true )
		{
			seq.authenticate();
			const novo = Forasteiro.build( { nome: dados.nome, descr: dados.descricao,  } );
			
			//CONTINUA...
		}
		else
		{

		}
	}
	)();


	res.redirect( `/sessao/${dados.usuario}/${dados.hexid}/` );
});

module.exports = router;
