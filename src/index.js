const { app } = require('./config/config');
const { PORTA } = require('./config/config');
const path = require('path');

//temporário
const { dbcredenciais } = require('./config/config');

/* LEI FEDERAL I - Requisições de métodos diferentes tem a mesma path*/
app.get( '/criarconta', (req,res,next)=>{ res.sendFile( path.join( __dirname, '/public/criarconta.html') ) } );

app.post( '/criarconta', (req,res,next)=>
{

	const login = req.body.login;
	const senha = req.body.senha;

	const { Pool } = require('pg');
	const postgres = new Pool( dbcredenciais );

	res.send(`<h1> O usuário ${login} de senha ${senha} foi salvo</h1> <a href='/'> voltar </a>`);

	postgres.query( 'INSERT INTO usuarios(login,senha) VALUES ($1,$2)', [login,senha] )
	.then( (res) => console.log( JSON.stringify(res) ) )
	.catch( (err) => console.log('TA PEGANDO FOGO BIXO!!!', err.stack ));

	postgres.end().then( () => console.log('FIM /CRIARCONTA') );

});

app.get( '/', (req,res,next)=>{ res.render( 'index', {express:"express"} ) } );

app.listen( PORTA, ()=>{ console.log(`ouvindo porta ${PORTA}`); } )

