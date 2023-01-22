'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class FichePoste extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	FichePoste.init(
		{
			label: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: true,
				},
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					is: /Prestation||CDI||CDD||Alternance||Stage/i,
					notNull: true,
				},
			},
			experience: {
				type: DataTypes.STRING(500),
				allowNull: true,
				validate: {
					len: [0, 500],
				},
			},
			entryDate: {
				type: DataTypes.DATE,
				allowNull: true,
				validate: {
					customValidator(value) {
						if (new Date(value) < new Date()) {
							throw new Error('invalid entryDate')
						}
					},
				},
			},
			endDate: {
				type: DataTypes.DATE,
				allowNull: true,
				validate: {
					customValidator(value) {
						if (new Date(value) < new Date()) {
							throw new Error('invalid endDate')
						}
					},
				},
			},
			localisation: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			destinationService: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			jobDescription: {
				type: DataTypes.STRING(600),
				allowNull: false,
				validate: {
					len: [1, 600],
				},
			},
			compensation: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			question1: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			question2: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			question3: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			question4: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			question5: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			urgency: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					is: /NON-URGENT||PEU-URGENT||URGENT||TRES-URGENT/i,
					notNull: true,
				},
			},
			validationRH: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
				allowNull: false,
				validate: {
					len: [0, 2],
				},
			},
			validationFinance: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
				allowNull: false,
				validate: {
					len: [0, 2],
				},
			},
			publicationRH: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
				allowNull: false,
				validate: {
					len: [0, 1],
				},
			},
			managerId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			rhId: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: null,
			},
			financeId: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: null,
			},
			archived: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
				allowNull: false,
				validate: {
					len: [0, 1],
				},
			},
		},
		{
			sequelize,
			modelName: 'FichePoste',
		},
	)
	return FichePoste
}
