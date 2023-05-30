const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORTA = 8080;

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

module.exports = { app, PORTA };
