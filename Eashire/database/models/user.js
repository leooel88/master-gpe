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
			firstName: {
				type: DataTypes.STRING,
				validate: {
					isAlpha: true,
					len: [2, 50],
				},
			},
			lastName: {
				type: DataTypes.STRING,
				validate: {
					isAlpha: true,
					len: [2, 50],
				},
			},
			email: {
				type: DataTypes.STRING,
				validate: {
					isEmail: true,
				},
			},
			jobLabel: {
				type: DataTypes.STRING,
				validate: {
					isAlphanumeric: true,
					len: [1, 50],
				},
			},
		},
		{
			sequelize,
			modelName: 'User',
		},
	)
	return User
}
