/* controlador para forasteiros */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { seq } = require( '../models/modelos' );
const { Forasteiro } = require( '../models/modelos' );

const { Token, uri } = require( '../models/sessao' );
const { MongoClient, ServerApiVersion } = require( 'mongodb' ); //gambiarra

const { dbinfos } = require( '../config/config' );

const adicionarforasteiroGet = (req,res,next)=>
{
	/* dbinfos.servidor = Endereço ip para requisições advindas de páginas
	dinâmicamente rederizadas. */
	const dados =
	{
		usuario: req.params.usuario,
		hexid: req.params.usuario,
		servidor: dbinfos.servidor
	};

	res.render('adicionarforasteiro', dados );
};

const adicionarforasteiroPost = (req,res,next)=>
{
	//criar forasteiro
	const dados =
	{
		usuario: req.params.usuario,
		hexid: req.params.usuario,
		servidor: dbinfos.servidor,
		nome: req.body.nome,
		descricao: req.body.nome
	};

	( async ()=>
	{
		const permissao = await HexIdAtivo( dados.usuario, dados.hexid );
		if ( permissao == true )
		{
			const novo = Forasteiro.build( { nome: dados.nome, descr: dados.descricao,  } );

			seq.authenticate();
			novo.save();
			
		}
		else
		{
				
		}
	}
	)();


	res.redirect( `/sessao/${dados.usuario}/${dados.hexid}/` );
};

modules.exports = { adicionarforasteiroGet, adicionarforasteiroPost  };
