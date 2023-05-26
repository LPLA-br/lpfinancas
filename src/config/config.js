const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORTA = 8080;
const dbcredenciais = { host:'127.0.0.1', user:'postgres' };

//rotas apenas para GET
//  const indexRouter = require('../routes/index');
//  const criarcRouter = require('../routes/criarconta');

app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

app.use(bodyParser.json());
app.use( bodyParser.urlencoded({ extended: false}) );

//usando as rotas GET
//app.use('/', indexRouter);
//app.use('/criarconta', criarcRouter);

//páginas html estáticas
//app.use( express.static( path.join(__dirname, '../public') ) );

// definindo motor de rederização das views
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

module.exports = { app, PORTA, dbcredenciais };
