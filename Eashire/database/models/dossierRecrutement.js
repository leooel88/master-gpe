'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class DossierRecrutement extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	DossierRecrutement.init(
		{
			candidatureId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'DossierRecrutement',
		},
	)
	return DossierRecrutement
}
