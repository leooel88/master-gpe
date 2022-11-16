const { FichePoste, Candidature } = require('@models')
const azureService = require('@utils/azureService/graph')
const errorHandler = require('@utils/errorHandler')
const loggerHandler = require('@utils/loggerHandler')

exports.process = async (req, res, next) => {
	if (loggerHandler.checkLoggedIn(req, res) === false) {
		return
	}
	let group = ''
	const groups = await azureService.getMainGroups(req.app.locals.msalClient, req.session.userId)

	if (groups.includes('RH')) {
		group = 'rh'
	}
	if (groups.includes('MANAGER')) {
		group = 'manager'
	}
	if (groups.includes('FINANCE')) {
		group = 'finance'
	}
	console.log(group)
	const result = []

	FichePoste.findAll()
		.then((foundFichePosteList) => {
			foundFichePosteList = foundFichePosteList.forEach((fichePoste, index) => {
				result.push(fichePoste.dataValues)
				const idFichePoste = fichePoste.dataValues.id
				Candidature.count({
					where: {
						fichePosteId: idFichePoste,
					},
				}).then(function (foundCandidatureList) {
					result[index].nbCandidature = foundCandidatureList
				})

				if (result[index].createdAt) {
					const offset_2 = result[index].createdAt.getTimezoneOffset()
					result[index].createdAt = new Date(
						result[index].createdAt.getTime() - offset_2 * 60 * 1000,
					)
					result[index].createdAt = result[index].createdAt.toISOString().split('T')[0]
					console.log('!!!!!', result[index].createdAt)
				}

				if (index % 2 == 0) {
					result[index].even = true
				}
				result[index].readLink = `/ficheposte/read/${fichePoste.dataValues.id}`

				if (result[index].entryDate) {
					const offset_1 = result[index].entryDate.getTimezoneOffset()
					result[index].entryDate = new Date(
						result[index].entryDate.getTime() - offset_1 * 60 * 1000,
					)
					result[index].entryDate = result[index].entryDate.toISOString().split('T')[0]
				}

				if (result[index].endDate) {
					const offset_2 = result[index].endDate.getTimezoneOffset()
					result[index].endDate = new Date(result[index].endDate.getTime() - offset_2 * 60 * 1000)
					result[index].endDate = result[index].endDate.toISOString().split('T')[0]
				}
			})

			const params = {
				active: { fichePosteList: true },
				fichePosteList: result,
				displayValidationIcons: true,
				group: group,
				fichePosteListNotNull: result.length > 0 ? 1 : 0,
			}
			res.render('fichePosteList', params)
		})
		.catch((err) => {
			console.log('ERROR : ')
			console.log(err)
			errorHandler.catchDataCreationError(err.errors, res, '')
		})
}
