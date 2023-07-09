/****************************************
 * sequelize - Object Relational Mapper
 ***************************************/

const { Sequelize, DataTypes, Model } = require('sequelize');
const mariadb = require('mariadb');

const { databases } = require( '../config/config' );
const seq = new Sequelize( 'lpfinancas', 'root', 'senha', { host: databases.mariadbip, dialect: 'mariadb' } );

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
				allowNull: false,
				unique: true
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

const Movimento = seq.define( 'Movimento',
{
	id:
		{
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
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
		},
	tipo:
		{
			type: DataTypes.TEXT,
			defaultValue: 'pagamento',
			allowNull: false
		}
},
{
	sequelize: seq,
	timestamps: false,
	tableName: 'movimentacoes'
});

//um para um OU muitos para um , um para muitos

Usuario.hasMany( Carteira );
Carteira.belongsTo( Usuario );

Usuario.hasMany( Forasteiro );
Forasteiro.belongsTo( Usuario );

//muitos para muitos

Carteira.belongsToMany( Forasteiro, { through: 'Movimento' } );
Forasteiro.belongsToMany( Carteira, { through: 'Movimento' } );

( async ()=>
{
	//setar para true
	if ( false )
	{
		try
		{
			await seq.authenticate();
			await seq.sync( { force: true } );
			await seq.close();
		}
		catch( erro )
		{
			console.log('FALHOU', erro);
		}
	}
})();

module.exports = { seq, Usuario, Forasteiro, Carteira, Movimento };
