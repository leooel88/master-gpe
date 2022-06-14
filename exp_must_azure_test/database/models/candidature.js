'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Candidature extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Candidature.init(
		{
			prenom: {
				type: DataTypes.STRING,
				validate: {
					isAlpha: true,
					len: [2, 50],
				},
			},
			nom: {
				type: DataTypes.STRING,
				validate: {
					isAlpha: true,
					len: [2, 50],
				},
			},
		},
		{
			sequelize,
			modelName: 'Candidature',
		}
	);
	return Candidature;
};
