'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.bulkInsert('FichePostes', [
			{
				label: 'Web developer',
				type: 'CDI',
				experience:
					'We need someone that is capable to create a NodeJS ReactJs application from scratch.\nThis job requires at least a year of ReactJS development, but also a design background.',
				entryDate: new Date('02/01/2023'),
				endDate: null,
				localisation: 'Paris 7th',
				destinationService: 'DSI',
				jobDescription:
					'The point of this post will be to create an entire ReactJS application, meant for the support branch of the company. It will use many intern APIs, and it has to have a soft and modern design.',
				compensation: '3000$/month',
				question1: 'Since how many years have you beeen a developer ?',
				question2: 'Have you ever worked with ReactJS ? Node JS ?',
				question3: 'Do you have some design skills and do you know how to use Figma ?',
				urgency: 'URGENT',
				managerId: '163afab7-1f6f-4cbd-8d4c-555fc2d0144f.60d0f7e3-be77-45dc-b859-5e51e8bbc47d',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				label: 'Designer',
				type: 'CDD',
				experience:
					'A huge background on Illustrator/Photoshop, and a huge knowledge of object design, packaging, modern communication.',
				entryDate: new Date('02/01/2023'),
				endDate: null,
				localisation: 'Lille',
				destinationService: 'Design pole',
				jobDescription:
					'At this post, you will ba asked to rebrand a whole branch of our products. You will have to create prototypes for a whole collection of products (product and packaging).',
				compensation: '3200$/month',
				question1: 'What school have you been to ?',
				question2: 'Do you know how to use Illustrator to create models ? And Photoshop ?',
				urgency: 'PEU-URGENT',
				managerId: '163afab7-1f6f-4cbd-8d4c-555fc2d0144f.60d0f7e3-be77-45dc-b859-5e51e8bbc47d',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				label: 'Team leader',
				type: 'CDI',
				experience: 'Administration background and skills on Azure.',
				entryDate: new Date('02/01/2023'),
				endDate: null,
				localisation: 'Bordeau',
				destinationService: 'Administration branch',
				jobDescription:
					'We are recruiting a team leader for a new team we are building in the administration branch. You will have to lead 5 people, working on support matters, on administration softwares.',
				compensation: '5000$/month',
				question1: 'Have you ever lead a team ?',
				question2: 'How good are your communication skills ?',
				question3: 'Do you know agile methodologie ?',
				urgency: 'URGENT',
				managerId: '163afab7-1f6f-4cbd-8d4c-555fc2d0144f.60d0f7e3-be77-45dc-b859-5e51e8bbc47d',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				label: 'Secretary',
				type: 'CDI',
				experience: 'Office softwares, communication skills, good coffee :) (need to be a man)',
				entryDate: new Date('02/01/2023'),
				endDate: null,
				localisation: 'Paris 7th',
				destinationService: 'General direction',
				jobDescription:
					'I (CEO) need a new secretary, as my current one is going to retire in the next few months. As I speak daily with important politics people, I need someone soft, and class, capable to speak naturally. I also need someone capable to right everything I say very quickly as I speak very quickly.',
				compensation: '4000$/month',
				question1: 'How fast can you write notes ?',
				question2: 'Where have you worked before ?',
				question3: 'How good is you geneeral culture ?',
				question4:
					'Would you be confortable with the idea of being in touch with politics (deputies for example) ?',
				urgency: 'TRES-URGENT',
				managerId: '163afab7-1f6f-4cbd-8d4c-555fc2d0144f.60d0f7e3-be77-45dc-b859-5e51e8bbc47d',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				label: 'Tech support',
				type: 'CDD',
				experience:
					'Computer and OS services (fixing and putting into service). Accesses and role software managment.',
				entryDate: new Date('02/01/2023'),
				endDate: null,
				localisation: 'Nantes',
				destinationService: 'Tech support',
				jobDescription:
					'We need to enforce our forces. So we need a new computer engineer. He will have to answer to employees wuestions and trouble with their professionnal computer, he also will have to manage accesses so all IT ressources.',
				compensation: '2500$/month',
				question1: 'Have you ever worked on Windows computers ?',
				question2: 'Do you know Azure services, and active directories way of working ?',
				urgency: 'NON-URGENT',
				managerId: '163afab7-1f6f-4cbd-8d4c-555fc2d0144f.60d0f7e3-be77-45dc-b859-5e51e8bbc47d',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				label: 'RH',
				type: 'CDI',
				experience: 'Simple RH tasks, and recruitment.',
				entryDate: new Date('02/01/2023'),
				endDate: null,
				localisation: 'Paris 7th',
				destinationService: 'Human ressources',
				jobDescription: 'We need to have a new RH in the supply chain RH team',
				compensation: '5000$/month',
				question1: 'Do you know supply chain ?',
				question2: 'Do you know Eashire application ? Have you ever worked on it ?',
				question3: 'How good are your communication skills when in big teams ?',
				urgency: 'PEU-URGENT',
				managerId: '163afab7-1f6f-4cbd-8d4c-555fc2d0144f.60d0f7e3-be77-45dc-b859-5e51e8bbc47d',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		])
	},

	async down(queryInterface, Sequelize) {
		return queryInterface.bulkDelete('FichePostes', null, {})
	},
}
