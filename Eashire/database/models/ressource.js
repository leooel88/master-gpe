'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Ressource extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Ressource.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			path: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			ownerUserId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			ownerUserDisplayName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			folderName: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: null,
			},
			sharable: {
				type: DataTypes.TINYINT,
				allowNull: false,
				defaultValue: 1,
			},
			adminFile: {
				type: DataTypes.TINYINT,
				allowNull: false,
				defaultValue: 0,
			},
		},
		{
			sequelize,
			modelName: 'Ressource',
		},
	)
	return Ressource
}
