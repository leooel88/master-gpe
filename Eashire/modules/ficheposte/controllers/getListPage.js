const { FichePoste } = require('../../../database/models')
const azureService = require('../../../utils/azureService/graph')
const errorHandler = require('../../../utils/errorHandler')
const loggerHandler = require('../../../utils/loggerHandler')

exports.process = async (req, res, next) => {
	if (loggerHandler.checkLoggedInRedirectSignInIfNot(req, res) === false) {
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
			}

			console.log('==================================')
			console.log('==================================')
			console.log(params)
			console.log('==================================')
			console.log('==================================')

			res.render('fichePosteList', params)
		})
		.catch((err) => {
			console.log('ERROR : ')
			console.log(err)
			errorHandler.catchDataCreationError(err.errors, res, '')
		})
}
