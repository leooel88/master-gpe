const { FichePoste } = require('../../../database/models')
const errorHandler = require('../../../utils/errorHandler')
const loggerHandler = require('../../../utils/loggerHandler')

exports.process = (req, res) => {
	if (loggerHandler.checkLoggedInRedirectSignInIfNot(req, res) === false) {
		return
	}

	// Validate request
	if (
		isEmptyOrSpaces(req.body.fichePoste_label) ||
		isEmptyOrSpaces(req.body.fichePoste_type) ||
		isEmptyOrSpaces(req.body.fichePoste_jobDescription) ||
		isEmptyOrSpaces(req.body.fichePoste_urgency)
	) {
		console.log('OIAEUOZIEUROZEIURZOEIRU')
		errorHandler.sendInvalidBodyError(res, 'fichePoste')
		return
	}
	// Create a Tutorial
	const fichePoste = {
		label: req.body.fichePoste_label,
		type: req.body.fichePoste_type,
		jobDescription: req.body.fichePoste_jobDescription,
		urgency: req.body.fichePoste_urgency,
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

	// Save Tutorial in the database
	FichePoste.create(fichePoste)
		.then((data) => {
			console.log(data)
			// res.send(data);
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
