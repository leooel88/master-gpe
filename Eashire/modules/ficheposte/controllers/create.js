const { FichePoste } = require('@models')
const errorHandler = require('@utils/errorHandler')
const jwt = require('jsonwebtoken')

exports.process = (req, res) => {
	if (
		isEmptyOrSpaces(req.body.fichePoste_label) ||
		isEmptyOrSpaces(req.body.fichePoste_type) ||
		isEmptyOrSpaces(req.body.fichePoste_jobDescription) ||
		isEmptyOrSpaces(req.body.fichePoste_urgency)
	) {
		errorHandler.sendInvalidBodyError(res, 'fichePoste')
		return
	}

	const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
	const { userId: managerId } = decodedToken

	const fichePoste = {
		label: req.body.fichePoste_label,
		type: req.body.fichePoste_type,
		jobDescription: req.body.fichePoste_jobDescription,
		urgency: req.body.fichePoste_urgency,
		managerId: managerId,
	}

	if (!isEmptyOrSpaces(req.body.fichePoste_experience)) {
		fichePoste.experience = req.body.fichePoste_experience
	}
	if (req.body.fichePoste_entryDate && req.body.fichePoste_entryDate_use) {
		fichePoste.entryDate = req.body.fichePoste_entryDate
	}
	if (req.body.fichePoste_endDate && req.body.fichePoste_endDate_use) {
		fichePoste.endDate = req.body.fichePoste_endDate
	}
	if (!isEmptyOrSpaces(req.body.fichePoste_localisation)) {
		fichePoste.localisation = req.body.fichePoste_localisation
	}
	if (!isEmptyOrSpaces(req.body.fichePoste_destinationService)) {
		fichePoste.destinationService = req.body.fichePoste_destinationService
	}
	if (!isEmptyOrSpaces(req.body.fichePoste_compensation)) {
		fichePoste.compensation = req.body.fichePoste_compensation
	}
	if (!isEmptyOrSpaces(req.body.fichePoste_question1)) {
		fichePoste.question1 = req.body.fichePoste_question1
	}
	if (!isEmptyOrSpaces(req.body.fichePoste_question2)) {
		fichePoste.question2 = req.body.fichePoste_question2
	}
	if (!isEmptyOrSpaces(req.body.fichePoste_question3)) {
		fichePoste.question3 = req.body.fichePoste_question3
	}
	if (!isEmptyOrSpaces(req.body.fichePoste_question4)) {
		fichePoste.question4 = req.body.fichePoste_question4
	}
	if (!isEmptyOrSpaces(req.body.fichePoste_question5)) {
		fichePoste.question5 = req.body.fichePoste_question5
	}

	FichePoste.create(fichePoste)
		.then((data) => {
			res.redirect(`/ficheposte/read/${data.id}`)
		})
		.catch((err) => {
			console.log('ERROR : ')
			console.log(err)
			errorHandler.catchDataCreationError(err.errors, res, 'fichePoste/create')
		})
}

function isEmptyOrSpaces(str) {
	return !str || str === null || str.match(/^ *$/) !== null
}
