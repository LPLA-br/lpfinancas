/****************************************
 * sequelize - Object Relational Mapper
 ***************************************/

const { Sequelize, DataTypes, Model } = require('sequelize');
const mariadb = require('mariadb');

const seq = new Sequelize( 'lpfinancas', 'root', 'mo69om', { host: '172.17.0.2', dialect: 'mariadb' } );

class Usuario extends Model { }
class Carteira extends Model { }
class Forasteiro extends Model { }

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
			},
		idhexadecimal:
			{
				type: DataTypes.STRING,
				allowNull: true
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

//tabelas muitos para muitos.

const Entrada = seq.define( 'Entrada',
{
	quantia:
		{
			type: DataTypes.FLOAT,
			allowNull: false
		},
	descr:
		{
			type: DataTypes.TEXT,
			defaultValue: 'sem Descrição'
		},
	data:
		{
			type: DataTypes.DATE,
			allowNull: false
		}
},
{
	sequelize: seq,
	timestamps: false,
	tableName: 'entradas'
});

const Saida = seq.define( 'Saida',
{
	quantia:
		{
			type: DataTypes.FLOAT,
			allowNull: false
		},
	descr:
		{
			type: DataTypes.TEXT,
			defaultValue: 'sem Descrição'
		},
	data:
		{
			type: DataTypes.DATE,
			allowNull: false
		}
},
{
	sequelize: seq,
	timestamps: false,
	tableName: 'saidas'
});

//um para um OU muitos para um , um para muitos

Usuario.hasMany( Carteira );
Carteira.belongsTo( Usuario );

Usuario.hasMany( Forasteiro );
Forasteiro.belongsTo( Usuario );

//muitos para muitos

Carteira.belongsToMany( Forasteiro, { through: 'Entrada' } );
Forasteiro.belongsToMany( Carteira, { through: 'Entrada' } );

Carteira.belongsToMany( Forasteiro, { through: 'Saida' } );
Forasteiro.belongsToMany( Carteira, { through: 'Saida' } );


( async ()=>
{
	try
	{
		await seq.authenticate();
		await seq.sync();
		await seq.close();
	}
	catch( erro )
	{	
		console.log('FALHOU', erro);
	}
})();

module.exports = { seq };
