/* middlewares */

const hexgen = async function()
{
	const nums = [ '0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f' ];
	const min = 0;
	const max = 15;

	return nums[ Math.floor( Math.random() * ( max - min + 1 ) + min ) ];
};

modules.exports = { hexgen };
