const { FichePoste } = require('@models')
const errorHandler = require('@utils/errorHandler')
const loggerHandler = require('@utils/loggerHandler')

exports.process = async (req, res) => {
	if (loggerHandler.checkLoggedInRedirectSignInIfNot(req, res) === false) {
		return
	}

	const fichePosteId = parseInt(req.params.fichePosteId, 10)

	let foundFichePoste = await FichePoste.findAll({
		where: {
			id: fichePosteId,
		},
	})

	foundFichePoste = foundFichePoste[0]

	if (!isEmptyOrSpaces(req.body.input_update_label)) {
		try {
			await FichePoste.update(
				{
					label: req.body.input_update_label,
					validationRH: 0,
					validationFinance: 0,
					publicationRH: 0,
				},
				{ where: { id: fichePosteId } },
			)
		} catch (err) {
			errorHandler.catchDataCreationError(err, res, `ficheposte/read/${fichePosteId}`)
			return
		}
	} else if (!isEmptyOrSpaces(req.body.input_update_type)) {
		try {
			await FichePoste.update(
				{
					type: req.body.input_update_type,
					validationRH: 0,
					validationFinance: 0,
					publicationRH: 0,
				},
				{ where: { id: fichePosteId } },
			)
		} catch (err) {
			errorHandler.catchDataCreationError(err, res, `ficheposte/read/${fichePosteId}`)
			return
		}
	} else if (!isEmptyOrSpaces(req.body.input_update_urgency)) {
		try {
			await FichePoste.update(
				{
					urgency: req.body.input_update_urgency,
					validationRH: 0,
					validationFinance: 0,
					publicationRH: 0,
				},
				{ where: { id: fichePosteId } },
			)
		} catch (err) {
			errorHandler.catchDataCreationError(err, res, `ficheposte/read/${fichePosteId}`)
			return
		}
	} else if (!isEmptyOrSpaces(req.body.input_update_jobDescription)) {
		try {
			await FichePoste.update(
				{
					jobDescription: req.body.input_update_jobDescription,
					validationRH: 0,
					validationFinance: 0,
					publicationRH: 0,
				},
				{ where: { id: fichePosteId } },
			)
		} catch (err) {
			errorHandler.catchDataCreationError(err, res, `ficheposte/read/${fichePosteId}`)
			return
		}
	} else if (req.body.input_update_localisation) {
		try {
			await FichePoste.update(
				{
					localisation: req.body.input_update_localisation,
					validationRH: 0,
					validationFinance: 0,
					publicationRH: 0,
				},
				{ where: { id: fichePosteId } },
			)
		} catch (err) {
			errorHandler.catchDataCreationError(err, res, `ficheposte/read/${fichePosteId}`)
			return
		}
	} else if (req.body.input_update_destinationService) {
		try {
			await FichePoste.update(
				{
					destinationService: req.body.input_update_destinationService,
					validationRH: 0,
					validationFinance: 0,
					publicationRH: 0,
				},
				{ where: { id: fichePosteId } },
			)
		} catch (err) {
			errorHandler.catchDataCreationError(err, res, `ficheposte/read/${fichePosteId}`)
			return
		}
	} else if (req.body.input_update_entryDate) {
		try {
			await FichePoste.update(
				{
					entryDate: req.body.input_update_entryDate,
					validationRH: 0,
					validationFinance: 0,
					publicationRH: 0,
				},
				{ where: { id: fichePosteId } },
			)
		} catch (err) {
			errorHandler.catchDataCreationError(err, res, `ficheposte/read/${fichePosteId}`)
			return
		}
	} else if (req.body.input_update_endDate) {
		try {
			await FichePoste.update(
				{
					endDate: req.body.input_update_endDate,
					validationRH: 0,
					validationFinance: 0,
					publicationRH: 0,
				},
				{ where: { id: fichePosteId } },
			)
		} catch (err) {
			errorHandler.catchDataCreationError(err, res, `ficheposte/read/${fichePosteId}`)
			return
		}
	} else if (req.body.input_update_experience) {
		try {
			await FichePoste.update(
				{
					experience: req.body.input_update_experience,
					validationRH: 0,
					validationFinance: 0,
					publicationRH: 0,
				},
				{ where: { id: fichePosteId } },
			)
		} catch (err) {
			errorHandler.catchDataCreationError(err, res, `ficheposte/read/${fichePosteId}`)
			return
		}
	} else if (req.body.input_update_compensation) {
		try {
			await FichePoste.update(
				{
					compensation: req.body.input_update_compensation,
					validationRH: 0,
					validationFinance: 0,
					publicationRH: 0,
				},
				{ where: { id: fichePosteId } },
			)
		} catch (err) {
			errorHandler.catchDataCreationError(err, res, `ficheposte/read/${fichePosteId}`)
			return
		}
	}

	res.redirect(`/ficheposte/read/${fichePosteId}`)
}

function isEmptyOrSpaces(str) {
	return !str || str === null || str.match(/^ *$/) !== null
}
