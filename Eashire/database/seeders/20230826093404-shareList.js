'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('ShareLists', [
			{
				ressourceId: 3,
				userId: '163afab7-1f6f-4cbd-8d4c-555fc2d0144f.60d0f7e3-be77-45dc-b859-5e51e8bbc47d',
				access: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		])
	},

	down: (queryInterface, Sequelize) => {
		/*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
	},
}
