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
			access: {
				type: DataTypes.TINYINT,
				allowNull: false,
				defaultValue: 0,
			},
		},
		{
			sequelize,
			modelName: 'ShareList',
		},
	)
	return ShareList
}
