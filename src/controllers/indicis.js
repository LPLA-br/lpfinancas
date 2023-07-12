/* controller para rota index.js */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { seq } = require( '../models/modelos' );
const { Usuario } = require( '../models/modelos' );

const { Token, uri } = require( '../models/sessao' );
const { MongoClient, ServerApiVersion } = require( 'mongodb' ); //gambiarra

const intraex = require('./intra-ex');
const carteiras = require('./carteiras');
const forasteiro = require('./forasteiro');

const criarconta = (req,res,next)=>
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
			let cria = false;

			await seq.authenticate();

			const usuario = await Usuario.findOne( { where: { login: login } } );
			
			if ( usuario == null )
			{
				cria = true;
				const novo = Usuario.build( { login: login, senha: senha } );
				await novo.save();
			}

			//await seq.close();

			if ( cria == true )
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

};

const login = (req,res,next)=>
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
			
			//await seq.close();

			if ( results?.login == login && results?.senha == senha )
			{
				//criar id hexadecimal no banco de dados mongo
				const hexid = await salvarHexidParaLogin( login );

				if ( hexid == undefined ) res.send( 'erro salvarHexidParaLogin(login:String)' );

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
			console.log( erro );
		}
	})();

}

const sair = (req,res,next)=>
{
	const client = new MongoClient( uri, { ServerApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true } } );

	//deletar id hexadecimal no banco de dados
	( async ()=>
	{
		try
		{
			const db = client.db("tokens");
			const tokens = db.collection("tokens");

			await tokens.deleteOne( { login: req.params.usuario } );

		}
		catch ( erro )
		{
			console.log( erro );
		}
		finally
		{
			await client.close();
		}
	})();
	res.redirect( '/' );
}

module.exports = { criarconta, login, sair };
