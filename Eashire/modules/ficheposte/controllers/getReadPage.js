const { FichePoste } = require('../../../database/models')
const azureService = require('../../../utils/azureService/graph')
const errorHandler = require('../../../utils/errorHandler')
const loggerHandler = require('../../../utils/loggerHandler')

exports.process = async (req, res, next) => {
	const isLoggedIn = loggerHandler.checkLoggedIn(req)

	const { error } = req.query

	const fichePosteId = parseInt(req.params.fichePosteId, 10)

	const params = {}

	if (error != null && error.length > 0) {
		params.error = [{ message: error }]
	}

	if (isLoggedIn === true) {
		const groups = await azureService.getMainGroups(req.app.locals.msalClient, req.session.userId)
		console.log(groups)
		if (groups.includes('RH')) {
			params.rh = true
			params.rhValidLink = `/ficheposte/rhvalid/${fichePosteId}`
			params.rhRefuseLink = `/ficheposte/rhrefuse/${fichePosteId}`
			params.rhPublishLink = `/ficheposte/rhpublish/${fichePosteId}`
		} else if (groups.includes('FINANCE')) {
			params.finance = true
			params.financeValidLink = `/ficheposte/financevalid/${fichePosteId}`
			params.financeRefuseLink = `/ficheposte/financerefuse/${fichePosteId}`
		} else if (groups.includes('MANAGER')) {
			params.manager = true
			params.managerUpdateLink = `/ficheposte/update/${fichePosteId}`
		}
	}

	FichePoste.findAll({
		where: {
			id: fichePosteId,
		},
	})
		.then((foundFichePoste) => {
			if (foundFichePoste[0].dataValues.entryDate) {
				const offset_1 = foundFichePoste[0].dataValues.entryDate.getTimezoneOffset()
				foundFichePoste[0].dataValues.entryDate = new Date(
					foundFichePoste[0].dataValues.entryDate.getTime() - offset_1 * 60 * 1000,
				)
				foundFichePoste[0].dataValues.entryDate = foundFichePoste[0].dataValues.entryDate
					.toISOString()
					.split('T')[0]
			}

			if (foundFichePoste[0].dataValues.endDate) {
				const offset_2 = foundFichePoste[0].dataValues.endDate.getTimezoneOffset()
				foundFichePoste[0].dataValues.endDate = new Date(
					foundFichePoste[0].dataValues.endDate.getTime() - offset_2 * 60 * 1000,
				)
				foundFichePoste[0].dataValues.endDate = foundFichePoste[0].dataValues.endDate
					.toISOString()
					.split('T')[0]
			}
			if (isLoggedIn === true) {
				params.isLoggedIn = true
				if (foundFichePoste[0].dataValues.validationRH == 0) {
					params.validationRhIsNull = true
				} else if (foundFichePoste[0].dataValues.validationRH == 1) {
					params.validationRhIsTrue = true
				} else if (foundFichePoste[0].dataValues.validationRH == 2) {
					params.validationRhIsFalse = true
				}

				params.updateLink = `/ficheposte/update/${foundFichePoste[0].dataValues.id}`
				params.displayValidationButtons = true
				params.displayQuestions = true
			} else {
				params.displayValidationButtons = false
				params.displayQuestions = false
				params.isLoggedIn = false
				params.candidateLink = `/candidature/create/${foundFichePoste[0].dataValues.id}`
			}

			params.active = { fichePosteRead: true }
			params.fichePoste = foundFichePoste[0].dataValues

			res.render('fichePosteRead', params)
		})
		.catch((err) => {
			console.log('ERROR : ')
			console.log(err)
			errorHandler.catchDataCreationError(err.errors, res, 'fichePosteList')
		})
}
