'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('Users', 'jobLabel', {
			type: Sequelize.STRING,
			allowNull: false,
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('Users', 'linkedin')
	},
}
