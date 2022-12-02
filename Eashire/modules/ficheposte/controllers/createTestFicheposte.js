const { FichePoste } = require('@models')
const errorHandler = require('@utils/errorHandler')

exports.process = (req, res, next) => {
	const fichePoste = {
		label: 'Architecte',
		type: 'CDD',
		jobDescription:
			"Architecte logiciel pour un projet web utilisant GCP. Il s'agit d'un projet de chatbot interactif, composé de plusieurs fonctionnalités mobiles, et d'un aspect cloud très improtant.",
		urgency: 'URGENT',
		experience:
			"Au moins 3 ans d'architecture web & connaissances GCP. Besoin d'une personne qui sait gérer une petite équipe. Motivé et intéressé par les projets cloud.",
		entryDate: addDays(new Date(), 1).toISOString(),
		localisation: 'Massy',
		destinationService: 'DSI',
		question1: "Combien d'années en tant qu'architecte ?",
		question2: 'Avez vous deja travaillé avec les services GCP ?',
	}

	// Save Tutorial in the database
	FichePoste.create(fichePoste)
		.then((data) => {
			const fichePoste = {
				label: 'Chef_d_équipe',
				type: 'CDI',
				jobDescription: "Chef d'une équipe de 6 développeurs",
				urgency: 'NON-URGENT',
				entryDate: addDays(new Date(), 30).toISOString(),
				endDate: addDays(new Date(), 60).toISOString(),
				localisation: 'Massy',
				destinationService: 'DSI',
				compensation: '3000$/mois',
				question1: "Combien d'années en tant chef d'équipe ?",
				question2: 'Avez vous deja travaillé en méthode scrum ?',
			}

			FichePoste.create(fichePoste)
				.then((data) => {
					console.log(data)

					const fichePoste = {
						label: 'Lead dev',
						type: 'ALTERNANCE',
						jobDescription: 'Lead dev pour un projet de chatbot',
						urgency: 'URGENT',
						entryDate: addDays(new Date(), 30).toISOString(),
						endDate: addDays(new Date(), 60).toISOString(),
						localisation: 'Paris',
						destinationService: 'DSI',
						compensation: '5000$/mois',
						question1: "Combien d'années en tant que lead dev ?",
						question2: 'Avez vous deja travaillé en méthode scrum ?',
						validationRH: 1,
						validationFinance: 1,
						publicationRH: 1,
					}

					FichePoste.create(fichePoste)
						.then((data) => {
							console.log(data)
							res.send(data)
						})
						.catch((err) => {
							console.log('ERROR : ')
							console.log(err)
							errorHandler.catchDataCreationError(err.errors, res, 'fichePoste/create')
						})
				})
				.catch((err) => {
					console.log('ERROR : ')
					console.log(err)
					errorHandler.catchDataCreationError(err.errors, res, 'fichePoste/create')
				})
		})
		.catch((err) => {
			console.log('ERROR : ')
			console.log(err)
			errorHandler.catchDataCreationError(err.errors, res, 'fichePoste/create')
		})
}

function addDays(date, days) {
	const result = new Date(date)
	result.setDate(result.getDate() + days)
	return result
}
