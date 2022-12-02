const { FichePoste, Candidature } = require('@models')
const azureService = require('@utils/azureService/graph')

exports.process = async (req, res, next) => {
	const candidatureId = parseInt(req.params.candidatureId, 10)

	let params = {}

	if (req.query.notes && req.query.notes == 'true') {
		params.displayNotes = true
	} else {
		params.displayNotes = false
	}

	if (req.query.tab && req.query.tab == 'rh') {
		params.displayTabRh = true
		params.displayTabManager = false
	} else {
		params.displayTabRh = false
		params.displayTabManager = true
	}

	let userParams

	const groups = await azureService.getMainGroups(req.app.locals.msalClient, req.session.userId)

	if (groups.includes('RH')) {
		userParams = {
			where: { id: candidatureId },
		}
		params.rh = true
		params.rhValidLink = `/candidature/rhvalid/${candidatureId}`
		params.rhRefuseLink = `/candidature/rhrefuse/${candidatureId}`
	} else if (groups.includes('MANAGER')) {
		userParams = {
			where: {
				id: candidatureId,
				validationRh: 1,
			},
		}
		params.manager = true
		params.managerValidLink = `/candidature/managervalid/${candidatureId}`
		params.managerRefuseLink = `/candidature/managerrefuse/${candidatureId}`
	} else if (groups.includes('FINANCE')) {
		userParams = {
			where: { id: candidatureId, validationRh: 1, validationManager: 1 },
		}
	} else {
		res.redirect('/')
	}

	Candidature.findAll(userParams).then(async (foundCandidature) => {
		const { fichePosteId } = foundCandidature[0].dataValues

		let currentFichePoste
		await FichePoste.findAll({
			where: { id: fichePosteId },
		}).then((foundFichePoste) => {
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
			currentFichePoste = foundFichePoste
		})
		params = {
			...params,
			active: {
				candidatureRead: true,
			},
			candidature: foundCandidature[0].dataValues,
			managerNote: foundCandidature[0].dataValues.managerComment,
			rhNote: foundCandidature[0].dataValues.rhComment,
			fichePosteLink: `/ficheposte/read/${fichePosteId}`,
			fichePoste: currentFichePoste[0].dataValues,
			displayValidationButtons: false,
			displayQuestions: true,
			isLoggedIn: true,
			imageUrl: `/servedFiles/CV/${foundCandidature[0].dataValues.cv}`,
			saveNoteLink: `/candidature/savenote/${foundCandidature[0].dataValues.id}`,
		}
		res.render('candidatureRead', params)
	})
}
