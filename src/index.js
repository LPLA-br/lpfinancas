const { app } = require('./config/config');
const { PORTA } = require('./config/config');


app.listen( PORTA, ()=>{ console.log(`ouvindo porta ${PORTA}`); } )
