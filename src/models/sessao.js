/**************************************
 * ODM moongose
 * gerência de sessão por id hexadecimal
 **************************************/
const moongose = require('mongoose');
const { Schema } = moongose;

const uri = "mongodb://root:mo69om@172.17.0.3:27017/tokens";
const tokenSchema = new Schema(
{
	login: String,
	hexid: String
});

const Token = moongose.model( 'Token', tokenSchema );

module.exports = { Token, uri };
