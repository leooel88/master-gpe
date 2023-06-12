const { FichePoste, Candidature } = require('@models')
const errorHandler = require('@utils/errorHandler')
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')

const { Op } = Sequelize

exports.process = (req, res, next) => {
	const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
	const { userId, rh: isRh, manager: isManager, finance: isFinance, it: isIt } = decodedToken
	const where = {}
	const result = []
	let group = ''

	if (isRh == true) {
		group = 'rh'
	}
	if (isManager == true) {
		group = 'manager'
	}
	if (isFinance == true) {
		group = 'finance'
	}

	if (req.body.label_filter && req.body.label_filter != '') {
		where.label = {
			[Op.like]: `%${req.body.label_filter}%`,
		}
	}
	if (
		req.body.urgency_filter &&
		req.body.urgency_filter != '' &&
		req.body.urgency_filter != 'Aucun'
	) {
		where.urgency = `${req.body.urgency_filter.replace('_', '-')}`
	}
	if (isManager == true) {
		if (req.body.owner_filter && req.body.owner_filter == 'owner_me') {
			where.managerId = `${userId}`
		}
	}
	if (
		req.body.day_filter &&
		req.body.day_filter != '' &&
		req.body.day_filter != '-' &&
		req.body.month_filter &&
		req.body.month_filter != '' &&
		req.body.month_filter != '-' &&
		req.body.year_filter &&
		req.body.year_filter != '' &&
		req.body.year_filter != '-'
	) {
		const date = new Date(
			req.body.year_filter.replace('year_', ''),
			req.body.month_filter.replace('month_', ''),
			req.body.day_filter.replace('day_', ''),
		)

		where.createdAt = {
			[Op.lte]: date,
		}
	}
	if (req.body.archived_filter && req.body.archived_filter != 'archived_no') {
		where.archived = 1
	}

	FichePoste.findAll({
		where: where,
	})
		.then(async (foundFichePosteList) => {
			let index = 0
			for (const fichePoste of foundFichePosteList) {
				if (
					isRh == true &&
					fichePoste.dataValues.rhId != null &&
					fichePoste.dataValues.rhId != userId
				) {
					continue
				} else if (
					isFinance == true &&
					fichePoste.dataValues.isFinance != null &&
					fichePoste.dataValues.isFinance != userId
				) {
					continue
				}

				result.push(fichePoste.dataValues)
				const idFichePoste = fichePoste.dataValues.id
				result[index].nbCandidature = await getCandidateNumber(idFichePoste)

				result[index].createdAt = transformDate(result[index].createdAt)

				if (index % 2 == 0) {
					result[index].even = true
				}
				result[index].readLink = `/ficheposte/read/${fichePoste.dataValues.id}`

				if (result[index].entryDate) {
					result[index].entryDate = transformDate(result[index].entryDate)
				}

				if (result[index].endDate) {
					result[index].endDate = transformDate(result[index].endDate)
				}
				index++
			}

			const params = {
				active: { fichePosteList: true },
				fichePosteList: result,
				displayValidationIcons: true,
				group: group,
				fichePosteListNotNull: result.length > 0 ? 1 : 0,
			}

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

			res.render('fichePosteList', {
				layout: 'mainWorkspaceSidebar',
				...params,
			})
		})
		.catch((err) => {
			errorHandler.catchDataCreationError(err.errors, res, '')
		})
}

async function getCandidateNumber(fichePosteid) {
	const nbrCandidature = await Candidature.count({
		where: {
			fichePosteId: fichePosteid,
		},
	})
	return nbrCandidature
}

function transformDate(date) {
	const offset = date.getTimezoneOffset()
	date = new Date(date.getTime() - offset * 60 * 1000)
	date = date.toISOString().split('T')[0]
	return date
}
