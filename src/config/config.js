const express = require('express');
const path = require('path');

const app = express();
const PORTA = 8080;

//rotas apenas para GET
//  const indexRouter = require('../routes/index');
//  const criarcRouter = require('../routes/criarconta');

app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

//usando as rotas GET
//app.use('/', indexRouter);
//app.use('/criarconta', criarcRouter);

app.get( '/', (req,res,next)=>{ res.render( 'index', {} ) } );
app.get( '/criarconta', (req,res,next)=>{ res.sendFile( path.join( __dirname, '../public/criarconta.html') ) } );

//páginas html estáticas
//app.use( express.static( path.join(__dirname, '../public') ) );

// definindo motor de rederização das views
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');



module.exports = { app, PORTA };
