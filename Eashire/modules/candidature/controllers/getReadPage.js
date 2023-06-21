const { FichePoste, Candidature, AccountCreationDemand } = require('@models')
const azureService = require('@utils/azureService/graph')
const jwt = require('jsonwebtoken')

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
	const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
	const { userId, rh: isRh, manager: isManager, finance: isFinance, it: isIt } = decodedToken

	if (isRh == true) {
		userParams = {
			where: { id: candidatureId },
		}
	} else if (isManager == true) {
		userParams = {
			where: {
				id: candidatureId,
				validationRh: 1,
			},
		}
	} else if (isFinance == true) {
		userParams = {
			where: { id: candidatureId, validationRh: 1, validationManager: 1 },
		}
	}

	Candidature.findAll(userParams).then(async (foundCandidature) => {
		if (
			foundCandidature[0].dataValues.validationManager == 1 &&
			foundCandidature[0].dataValues.validationRh == 1
		) {
			if (isRh == true) {
				params.createDossierRecrutement = `/dossierrecrutement/create/${candidatureId}`
			} else if (isManager == true) {
				params.managerValidLink = `/candidature/managervalid/${candidatureId}`
				params.managerRefuseLink = `/candidature/managerrefuse/${candidatureId}`
			}
		} else {
			if (isRh == true) {
				params.rhValidLink = `/candidature/rhvalid/${candidatureId}`
				params.rhRefuseLink = `/candidature/rhrefuse/${candidatureId}`
			} else if (isManager == true) {
				params.managerValidLink = `/candidature/managervalid/${candidatureId}`
				params.managerRefuseLink = `/candidature/managerrefuse/${candidatureId}`
			}
		}

		if (isRh == true) {
			params.rh = true
		} else if (isManager == true) {
			params.manager = true
		}

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

		if (foundCandidature[0].dataValues.accountDemand != null) {
			const foundAccountCreationDemand = await AccountCreationDemand.findAll({
				where: { candidatureId: foundCandidature[0].dataValues.id },
			})
			if (
				foundAccountCreationDemand &&
				foundAccountCreationDemand.length > 0 &&
				foundAccountCreationDemand[0].dataValues
			) {
				params.accountCreationDemandLink = `/accountcreationdemand/read/${foundAccountCreationDemand[0].dataValues.id}`
				params.accountDemandPresent = true
			}
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
		res.render('candidatureRead', {
			layout: 'mainWorkspaceSidebar',
			...params,
		})
	})
}
