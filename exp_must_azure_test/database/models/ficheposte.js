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
				allowNull: false,
				validate: {
					isAlphanumeric: true,
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
		},
		{
			sequelize,
			modelName: 'FichePoste',
		}
	);
	return FichePoste;
};
