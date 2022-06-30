'use strict';
const { Model } = require('sequelize');
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
				validate: {
					isAlphanumeric: true,
					allowNull: false,
				},
			},
			type: {
				type: DataTypes.STRING,
				validate: {
					is: /Prestation||CDI||CDD||Alternance||Stage/i,
					allowNull: false,
				},
			},
		},
		{
			sequelize,
			modelName: 'FichePoste',
		}
	);
	return FichePoste;
};
