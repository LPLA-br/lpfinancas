const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { seq } = require( '../models/modelos' );
const { Forasteiro } = require( '../models/modelos' );

const { Token, uri } = require( '../models/sessao' );
const { MongoClient, ServerApiVersion } = require( 'mongodb' ); //gambiarra

const { dbinfos } = require( '../config/config' );

const forasteiris = require( '../controllers/forasteiris' );

async function HexIdAtivo( login, hexid )
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

router.get( '/sessao/:usuario/:hexid/adicionarforasteiro', forasteiris.adicionarforasteiroGet );

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

//---------------- POST

router.post( '/sessao/:usuario/:hexid/adicionarforasteiro', forasteiris.adicionarforasteiroPost );

module.exports = router;
