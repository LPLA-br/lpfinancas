const { app } = require('./config/config');
const { PORTA } = require('./config/config');

//const { criarusuario } = require('./post/criarusuario');
//app.post( '/criarusuario', criarusuario );

app.listen( PORTA, ()=>{ console.log(`ouvindo porta ${PORTA}`); } )

