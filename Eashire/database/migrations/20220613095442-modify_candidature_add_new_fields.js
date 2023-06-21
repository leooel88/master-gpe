'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('Candidatures', 'nom', {
			type: Sequelize.STRING,
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('Candidatures', 'nom')
	},
}
