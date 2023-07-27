'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Event extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Event.init(
		{
			eventId: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: true,
				},
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					is: /INTERVIEW||FOLLWING/i,
					notNull: true,
				},
			},
			candidatureId: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			employeeId: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			sequelize,
			modelName: 'Event',
		},
	)
	return Event
}
