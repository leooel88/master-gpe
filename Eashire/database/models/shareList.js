'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class ShareList extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	ShareList.init(
		{
			ressourceId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			userId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'ShareList',
		},
	)
	return ShareList
}
