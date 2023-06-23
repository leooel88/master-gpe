const { FichePoste, Candidature } = require('@models')
const azureService = require('@utils/azureService/graph')
const jwt = require('jsonwebtoken')

exports.process = async (req, res, next) => {
	const candidatureId = parseInt(req.params.candidatureId, 10)
	const params = {}
	const result = []
	let userParams
	let userRole = ''
	const ficheposte_list = []

	const groups = await azureService.getMainGroups(req.app.locals.msalClient, req.session.userId)

	if (groups.includes('RH')) {
		userRole = 'rh'
		params.rh = true
	} else if (groups.includes('FINANCE')) {
		userRole = 'finance'
		userParams = {
			where: { validationRh: 1, validationManager: 1 },
		}
	} else if (groups.includes('IT')) {
		userRole = 'it'
		userParams = {
			where: { validationRh: 1, validationManager: 1 },
		}
	} else if (groups.includes('MANAGER')) {
		userParams = {
			where: { validationRh: 1 },
		}
		params.manager = true
		userRole = 'manager'
	} else {
		res.redirect('/')
	}

	Candidature.findAll(userParams).then((foundCandidatures) => {
		if (typeof foundCandidatures == 'undefined') {
			res.redirect('/dashboard')
			return
		}

		foundCandidatures = foundCandidatures.forEach((candidature, index) => {
			const offset_1 = candidature.dataValues.createdAt.getTimezoneOffset()
			candidature.dataValues.createdAt = new Date(
				candidature.dataValues.createdAt.getTime() - offset_1 * 60 * 1000,
			)
			candidature.dataValues.createdAt = candidature.dataValues.createdAt
				.toISOString()
				.split('T')[0]

			result.push(candidature.dataValues)

			if (index % 2 == 0) {
				result[index].even = true
			}

			result[index].readLink = `/candidature/read/${candidature.dataValues.id}`
			FichePoste.findAll({
				where: { id: candidature.dataValues.fichePosteId },
			}).then((foundFichePoste) => {
				result[index].fichePoste = foundFichePoste[0].dataValues
				if (
					!ficheposte_list.find((element) => element.label === foundFichePoste[0].dataValues.label)
				)
					ficheposte_list.push({
						label: foundFichePoste[0].dataValues.label,
						value: `ficheposte_id_${foundFichePoste[0].dataValues.id}`,
					})
			})
		})

		params.ficheposte_list = ficheposte_list
		params.active = { candidatureList: true }
		params.candidatureList = result
		params.group = userRole

		const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
		const { userId, rh: isRh, manager: isManager, finance: isFinance, it: isIt } = decodedToken
		params.userId = userId

		if (isRh == true) {
			params.rh = true
		}
		if (isManager == true) {
			params.manager = true
		}
		if (isFinance == true) {
			params.finance = true
		}
		if (isIt == true) {
			params.it = true
		}

		res.render('candidatureList', {
			layout: 'mainWorkspaceSidebar',
			...params,
		})
	})
}
