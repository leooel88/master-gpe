'use strict';
const { Model } = require('sequelize');

const phoneValidationRegex = /^(\+33 |0)[1-9]( \d\d){4}$/
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
				allowNull: false,
				validate: {
					isAlpha: true,
					len: [2, 50],
				},
			},
			nom: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isAlpha: true,
					len: [2, 50],
				},
			},
			mail: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isEmail: true,
				},
			},
			telephone: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					validator: function(v) {
						return phoneValidationRegex.test(v); 
					},
				},
			},
			fichePosteId: {
				type: DataTypes.TINYINT,
				allowNull: false,
			},
			cv: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [1, 255],
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
