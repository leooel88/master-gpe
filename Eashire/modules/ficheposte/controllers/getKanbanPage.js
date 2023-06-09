const { FichePoste, Candidature } = require('@models')
const azureService = require('@utils/azureService/graph')
const errorHandler = require('@utils/errorHandler')
const jwt = require('jsonwebtoken')

exports.process = async (req, res, next) => {
	let group = ''
	let rh
	let manager
	let it
	let finance

	const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
	const { userId, rh: isRh, manager: isManager, finance: isFinance, it: isIt } = decodedToken

	if (isRh == true) {
		group = 'rh'
		rh = true
	}
	if (isManager == true) {
		group = 'manager'
		manager = true
	}
	if (isFinance == true) {
		group = 'finance'
		finance = true
	}
	if (isIt == true) {
		it = true
	}

	const result = []

	FichePoste.findAll()
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
			if (rh == true) {
				params.rh = true
			}
			if (manager == true) {
				params.manager = true
			}
			if (it == true) {
				params.it = true
			}
			if (finance == true) {
				params.finance = true
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
