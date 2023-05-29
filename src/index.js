const { app } = require('./config/config');
const { PORTA } = require('./config/config');

/* LEI FEDERAL I - Requisições de mesma path podem ter N métodos para ela.*/

app.listen( PORTA, ()=>{ console.log(`ouvindo porta ${PORTA}`); } )

