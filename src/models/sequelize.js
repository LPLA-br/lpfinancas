/****************************************
 * sequelize - Object Relational Mapper
 ***************************************/

const { Sequelize, DataTypes, Model } = require('sequelize');
const pg = require( 'pg' );

const seq = new Sequelize( 'postgres://postgres:mo69om@172.18.0.2:5432/testes', { dialect: 'postgres' } );

class Usuario extends Model { }
class Carteira extends Model { }
class Forasteiro extends Model {  }

Usuario.init(
	{

		id:
			{
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
		login:
			{
				type: DataTypes.STRING,
				allowNull: false
			},
		senha:
			{
				type: DataTypes.STRING,
				allowNull: false
			}
	},
	{
		sequelize: seq,
		modelName: 'Usuario',
		tableName: 'Usuarios',
		timestamps: true
	}
);

Carteira.init(
	{
		id:
			{
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
		unidade_monetaria:
			{
				type: DataTypes.CHAR,
				allowNull: false,
				defaultValue: '???'
			},
		motante:
			{
				type: DataTypes.FLOAT,
				allowNull: false
			}
	},
	{
		sequelize: seq,
		modelName: 'Carteira',
		tableName: 'Carteiras',
		timestamps: true
	}
);

Forasteiro.init(
	{
		id:
			{
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
		nome:
			{
				type: DataTypes.STRING(50),
				defaultValue: 'sem nome'
			},
		descr:
			{
				type: DataTypes.TEXT,
				defaultValue: 'sem descrição'
			}
	},
	{
		sequelize: seq,
		modelName: 'Forasteiro',
		tableName: 'Forasteiros',
		timestamps: true
	}

);

( async ()=>
{
	try
	{
		await seq.authenticate();
		await seq.sync();

		const luizito = Usuario.build( { login: 'luizito', senha: '123' } );
		await luizito.save();

		await seq.close();
	}
	catch( erro )
	{	
		console.log('FALHOU', erro);
	}
})();
