'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	User.init(
		{
			userId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			displayName: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [2, 50],
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [2, 50],
				},
			},
			rh: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			manager: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			finance: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			it: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
		},
		{
			sequelize,
			modelName: 'User',
		},
	)
	return User
}
