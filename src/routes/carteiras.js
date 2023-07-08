const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

router.get( '/sessao/:usuario/criarcarteira', (req,res,next)=>
{
});

router.post( '/sessao/:usuario/criarcarteira', (req,res,next)=>
{
});

router.get( '/sessao/:usuario/editarcarteira', (req,res,next)=>
{
	res.render( 'sessao', { usuario: req.params.usuario });
});

router.get( '/sessao/:usuario/visualizarcarteira', (req,res,next)=>
{
});

router.post( '/sessao/:usuario/visualizarcarteira', (req,res,next)=>
{
});

router.get( '/sessao/:usuario/deletarcarteira', (req,res,next)=>
{
});

module.exports = router;
