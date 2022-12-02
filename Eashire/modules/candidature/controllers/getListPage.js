const { FichePoste, Candidature } = require('@models')
const azureService = require('@utils/azureService/graph')

exports.process = async (req, res, next) => {
	const candidatureId = parseInt(req.params.candidatureId, 10)
	const params = {}
	const result = []
	let userParams
	let userRole = ''

	const groups = await azureService.getMainGroups(req.app.locals.msalClient, req.session.userId)

	if (groups.includes('RH')) {
		userRole = 'rh'
		params.rh = true
	} else if (groups.includes('FINANCE')) {
		userRole = 'finance'
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
			})
		})

		params.active = { candidatureList: true }
		params.candidatureList = result
		params.group = userRole

		res.render('candidatureList', params)
	})
}
