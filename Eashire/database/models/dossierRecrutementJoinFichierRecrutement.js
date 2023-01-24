'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class DossierRecrutementJoinFichierRecrutement extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	DossierRecrutementJoinFichierRecrutement.init(
		{
			dossierRecrutementId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			fichierRecrutementId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'DossierRecrutementJoinFichierRecrutement',
		},
	)
	return DossierRecrutementJoinFichierRecrutement
}
