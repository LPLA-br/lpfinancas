const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

router.get( '/sessao/:usuario/entradas', (req,res,next)=>
{
	res.render( 'sessao', { usuario: req.params.usuario });
});

router.get( '/sessao/:usuario/saidas', (req,res,next)=>
{
	res.render( 'sessao', { usuario: req.params.usuario });
});

module.exports = router;
