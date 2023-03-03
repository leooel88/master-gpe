'use strict'
const { Model } = require('sequelize')

const phoneValidationRegex = /^(\+33 |0)[1-9]( \d\d){4}$/
module.exports = (sequelize, DataTypes) => {
	class AccountCreationDemand extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	AccountCreationDemand.init(
		{
			prenom: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					validator: function (v) {
						const nameFormat = /^[ a-zA-Z\-/']+$/
						return nameFormat.test(v)
					},
					len: [2, 50],
				},
			},
			nom: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					validator: function (v) {
						const nameFormat = /^[ a-zA-Z\-/']+$/
						return nameFormat.test(v)
					},
					len: [2, 50],
				},
			},
			telephone: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					validator: function (v) {
						return phoneValidationRegex.test(v)
					},
				},
			},
			label: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: true,
				},
			},
			destinationService: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			jobLocation: {
				type: DataTypes.STRING(600),
				allowNull: false,
				validate: {
					len: [1, 600],
				},
			},
			conversationId: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			fichePosteId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			candidatureId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			demandingRhId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			rhDisplayName: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [2, 50],
				},
			},
			itId: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			status: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
				allowNull: false,
				validate: {
					len: [0, 2],
				},
			},
		},
		{
			sequelize,
			modelName: 'AccountCreationDemand',
		},
	)
	return AccountCreationDemand
}
