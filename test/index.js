const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );

app.get( '/rinoceteio/*', (req, res, next) =>
{
	res.send( `<h1>${req.url}<h1><h2>${ req.query.atributo ?? 'UNDEFINED' }<h2>` );
});

app.get( '/oieteconir/:usuario', (req, res, next) =>
{
	res.send( `<h1>res.params.usuario: ${ req.params.usuario ?? 'UNDEFINED' }</h1>` );
});

app.listen( port, console.log( "EXPRESS LEARNING OUVINDO NA PORTA " + port ) );
