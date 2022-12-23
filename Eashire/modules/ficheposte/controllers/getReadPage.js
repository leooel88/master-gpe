const { FichePoste } = require('@models')
const auth = require('@utils/authentication')
const azureService = require('@utils/azureService/graph')
const errorHandler = require('@utils/errorHandler')
const jwt = require('jsonwebtoken')

exports.process = async (req, res, next) => {
	const isLoggedIn = auth.isAuthenticated(req)

	const { error } = req.query

	const fichePosteId = parseInt(req.params.fichePosteId, 10)

	const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
	const { userId, rh: isRh, manager: isManager, finance: isFinance } = decodedToken

	const params = {}

	if (error != null && error.length > 0) {
		params.error = [{ message: error }]
	}

	if (isLoggedIn === true) {
		const groups = await azureService.getMainGroups(req.app.locals.msalClient, req.session.userId)
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
		.then(async (foundFichePoste) => {
			const fichePosteData = foundFichePoste[0].dataValues
			if (isRh == true && fichePosteData.rhId == null) {
				await saveRh(fichePosteData.id, userId)
			} else if (isFinance == true && fichePosteData.isFinance == null) {
				await saveFinance(fichePosteData.id, userId)
			}

			if (fichePosteData.entryDate) {
				const offset_1 = fichePosteData.entryDate.getTimezoneOffset()
				fichePosteData.entryDate = new Date(
					fichePosteData.entryDate.getTime() - offset_1 * 60 * 1000,
				)
				fichePosteData.entryDate = fichePosteData.entryDate.toISOString().split('T')[0]
			}

			if (fichePosteData.endDate) {
				const offset_2 = fichePosteData.endDate.getTimezoneOffset()
				fichePosteData.endDate = new Date(fichePosteData.endDate.getTime() - offset_2 * 60 * 1000)
				fichePosteData.endDate = fichePosteData.endDate.toISOString().split('T')[0]
			}
			if (isLoggedIn === true) {
				params.isLoggedIn = true
				if (fichePosteData.validationRH == 0) {
					params.validationRhIsNull = true
				} else if (fichePosteData.validationRH == 1) {
					params.validationRhIsTrue = true
				} else if (fichePosteData.validationRH == 2) {
					params.validationRhIsFalse = true
				}

				params.updateLink = `/ficheposte/update/${fichePosteData.id}`
				params.displayValidationButtons = true
				params.displayQuestions = true
			} else {
				params.displayValidationButtons = false
				params.displayQuestions = false
				params.isLoggedIn = false
				params.candidateLink = `/candidature/create/${fichePosteData.id}`
			}

			params.active = { fichePosteRead: true }
			params.fichePoste = fichePosteData

			res.render('fichePosteRead', params)
		})
		.catch((err) => {
			errorHandler.catchDataCreationError(err.errors, res, 'fichePosteList')
		})
}

async function saveRh(fichePosteId, userId) {
	await FichePoste.update(
		{
			rhId: userId,
		},
		{ where: { id: fichePosteId } },
	)
}

async function saveFinance(fichePosteId, userId) {
	await FichePoste.update(
		{
			financeId: userId,
		},
		{ where: { id: fichePosteId } },
	)
}
