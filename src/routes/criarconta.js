const express = require('express');
const router = express.Router();

router.get('/criarconta', (req, res, next)=>
{
	res.sendFile( '../public/criarconta.html');
});

module.exports = router;
