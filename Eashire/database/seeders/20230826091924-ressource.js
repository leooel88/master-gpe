'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('Ressources', [
			{
				name: 'ressource_1',
				path: '/servedFiles/ressources/ressource_1.pdf',
				ownerUserId: '163afab7-1f6f-4cbd-8d4c-555fc2d0144f.60d0f7e3-be77-45dc-b859-5e51e8bbc47d',
				ownerUserDisplayName: 'manager',
				shareListId: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Ressource 2',
				path: '/servedFiles/ressources/Ressource 2.pdf',
				ownerUserId: '163afab7-1f6f-4cbd-8d4c-555fc2d0144f.60d0f7e3-be77-45dc-b859-5e51e8bbc47d',
				ownerUserDisplayName: 'manager',
				shareListId: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Ressource 3',
				path: '/servedFiles/ressources/Ressource 3.pdf',
				ownerUserDisplayName: 'abdc',
				ownerUserId: 'abcd',
				shareListId: '1',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Ressource 4',
				path: '/servedFiles/ressources/Ressource 4.pdf',
				ownerUserDisplayName: 'abcd',
				ownerUserId: 'abcd',
				shareListId: null,
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
