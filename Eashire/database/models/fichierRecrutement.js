'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class FichierRecrutement extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	FichierRecrutement.init(
		{
			title: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [2, 50],
				},
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [0, 700],
				},
			},
			dossierRecrutementId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'FichierRecrutement',
		},
	)
	return FichierRecrutement
}
