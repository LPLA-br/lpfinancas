/**************************************
 * ODM moongose
 * gerência de sessão por id hexadecimal
 **************************************/
const moongose = require('mongoose');
const { Schema } = moongose;

const { dbinfos } = require( '../config/config' );

const uri = `mongodb://root:mo69om@${dbinfos.mongodbip}:27017/tokens`;
const tokenSchema = new Schema(
{
	login: String,
	hexid: String
});

const Token = moongose.model( 'Token', tokenSchema );

module.exports = { Token, uri };
