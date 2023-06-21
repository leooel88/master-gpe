'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Message extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Message.init(
		{
			conversationId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			text: {
				type: DataTypes.STRING(500),
				allowNull: false,
				validate: {
					len: [1, 500],
				},
			},
			messageOrderId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			isNew: {
				type: DataTypes.TINYINT,
				defaultValue: 1,
				allowNull: false,
				validate: {
					len: [0, 1],
				},
			},
			ownerUserId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			ownerDisplayName: {
				type: DataTypes.STRING(500),
				allowNull: false,
				validate: {
					len: [1, 500],
				},
			},
		},
		{
			sequelize,
			modelName: 'Message',
		},
	)
	return Message
}
