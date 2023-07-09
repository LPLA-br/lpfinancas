const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORTA = 8080;

const databases =
{
	mariadbip: '172.17.0.2',
	mongodbip: '172.17.0.3',
	portas:
	{
		mariadb: '3306',
		mongodb: '27017'
	},
	senha: 'mo69om',
	usuario: 'root',
	mongodbdatabase: 'token',
	mariadbdatabase: 'lpfinancas',
	servidor: '127.0.0.1'
};

//rotas apenas para GET
const indexRouter = require('../routes/index');

app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

app.use(bodyParser.json());
app.use( bodyParser.urlencoded({ extended: false}) );

app.use('/', indexRouter );

//páginas html estáticas. descomente para ativar.
//app.use( express.static( path.join(__dirname, '../public') ) );

// definindo motor de rederização das views
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

module.exports = { app, PORTA, databases };
