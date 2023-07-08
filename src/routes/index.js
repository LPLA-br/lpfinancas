const express = require('express');
const router = express.Router();
//const session = require( 'express-session' );

const intraex = require('./intra-ex');
const carteiras = require('./carteiras');
const forasteiro = require('./forasteiro');

router.use( intraex );
router.use( carteiras );
router.use( forasteiro );

router.get('/', (req, res, next)=>
{
	res.send('aa');
});

router.get( '/criarconta', (req,res,next)=>
{
});

router.post( '/criarconta', (req,res,next)=>
{
});

router.get( '/login', (req,res,next)=>
{
});

router.post( '/login', (req,res,next)=>
{
});

// --- aplicação ---
/* req.params.usuario -> :usuario */

router.get('/sessao/:usuario/', (req,res,next)=>
{
});

router.get( '/sessao/:usuario/sair', ()=>
{
});


module.exports = router;
