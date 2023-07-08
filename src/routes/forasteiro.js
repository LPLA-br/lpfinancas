const express = require('express');
const router = express.Router();

router.get( '/sessao/:usuario/adicionarforasteiro', (req,res,next)=>
{
	res.render('adicionarforasteiro', { usuario: req.params.usuario });
});

router.post( '/sessao/:usuario/adicionarforasteiro', (req,res,next)=>
{
	const { nome } = req.body;
	const { descricao } = req.body;
});

router.get( '/sessao/:usuario/editarforasteiro', (req,res,next)=>
{
	res.render( 'sessao', { usuario: req.params.usuario });
});

router.get( '/sessao/:usuario/visualizarforasteiros', (req,res,next)=>
{
	res.render( 'sessao', { usuario: req.params.usuario });
});

router.get( '/sessao/:usuario/deletarforasteiro', (req,res,next)=>
{
	res.render( 'sessao', { usuario: req.params.usuario });
});

module.exports = router;
