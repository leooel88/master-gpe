const { FichePoste, Candidature } = require('@models')
const azureService = require('@utils/azureService/graph')
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')

const { Op } = Sequelize

exports.process = async (req, res, next) => {
	const candidatureId = parseInt(req.params.candidatureId, 10)
	const params = {}
	const result = []
	let where = {}
	let where_2
	let userRole = ''
	const ficheposte_list = []

	const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
	const { userId, rh: isRh, manager: isManager, finance: isFinance, it: isIt } = decodedToken

	const groups = await azureService.getMainGroups(req.app.locals.msalClient, req.session.userId)

	if (isRh == true) {
		userRole = 'rh'
		params.rh = true
		where = { where: {} }
	} else if (isFinance == true) {
		userRole = 'finance'
		where = {
			where: { validationRh: 1, validationManager: 1 },
		}
		where_2 = {
			where: { validationRh: 1, validationManager: 1 },
		}
	} else if (isIt == true) {
		userRole = 'it'
		where = {
			where: { validationRh: 1, validationManager: 1 },
		}
		where_2 = {
			where: { validationRh: 1, validationManager: 1 },
		}
	} else if (isManager == true) {
		where = {
			where: { validationRh: 1 },
		}
		where_2 = {
			where: { validationRh: 1 },
		}
		params.manager = true
		userRole = 'manager'
	} else {
		res.redirect('/')
	}

	if (req.body.name_filter && req.body.name_filter != '') {
		const names = req.body.name_filter.split(' ')
		const prenomTab = []
		const nomTab = []
		for (const name of names) {
			if (name != '') {
				prenomTab.push({
					prenom: {
						[Op.like]: `%${name}%`,
					},
				})
				nomTab.push({
					nom: {
						[Op.like]: `%${name}%`,
					},
				})
			}
		}

		where.where = { ...where.where, [Op.or]: [...prenomTab, ...nomTab] }
	}

	if (
		req.body.ficheposte_filter &&
		req.body.ficheposte_filter != '' &&
		req.body.ficheposte_filter != '-'
	) {
		where.where.fichePosteId = req.body.ficheposte_filter.replace('ficheposte_id_', '')
	}

	if (
		req.body.day_candidature_filter &&
		req.body.day_candidature_filter != '' &&
		req.body.day_candidature_filter != '-' &&
		req.body.month_candidature_filter &&
		req.body.month_candidature_filter != '' &&
		req.body.month_candidature_filter != '-' &&
		req.body.year_candidature_filter &&
		req.body.year_candidature_filter != '' &&
		req.body.year_candidature_filter != '-'
	) {
		const date = new Date(
			req.body.year_candidature_filter.replace('year_candidature_', ''),
			req.body.month_candidature_filter.replace('month_candidature_', ''),
			req.body.day_candidature_filter.replace('day_candidature_', ''),
		)

		where.where.createdAt = {
			[Op.lte]: date,
		}
	}

	Candidature.findAll(where).then((foundCandidatures) => {
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

		Candidature.findAll(where_2).then((foundCandidatures) => {
			foundCandidatures = foundCandidatures.forEach((candidature, index) => {
				FichePoste.findAll({
					where: { id: candidature.dataValues.fichePosteId },
				}).then((foundFichePoste) => {
					if (
						!ficheposte_list.find(
							(element) => element.label === foundFichePoste[0].dataValues.label,
						)
					)
						ficheposte_list.push({
							label: foundFichePoste[0].dataValues.label,
							value: `ficheposte_id_${foundFichePoste[0].dataValues.id}`,
						})
				})
			})
		})

		params.ficheposte_list = ficheposte_list
		params.active = { candidatureList: true }
		params.candidatureList = result
		params.group = userRole

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
