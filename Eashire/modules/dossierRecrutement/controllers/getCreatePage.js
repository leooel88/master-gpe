const {
	Candidature,
	DossierRecrutement,
	FichierRecrutement,
	FichePoste,
	DossierRecrutementJoinFichierRecrutement,
} = require('@models')
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')

const { Op } = Sequelize

exports.process = async (req, res) => {
	const candidatureId = parseInt(req.params.candidatureId, 10)
	const params = {}
	let candidature

	const foundCandidature = await Candidature.findAll({
		where: { id: candidatureId },
	})

	if (!foundCandidature || !foundCandidature.length > 0) {
		res.redirect('/')
		return 0
	}

	const foundDossierRecrutement = await DossierRecrutement.findAll({
		where: { candidatureId: candidatureId },
	})
	let dossierRecrutement
	if (foundDossierRecrutement && foundDossierRecrutement.length > 0) {
		dossierRecrutement = foundDossierRecrutement[0].dataValues
		const foundFichierRecrutement = await FichierRecrutement.findAll({
			where: { dossierRecrutementId: dossierRecrutement.id },
		})

		let fichierRecrutement = []
		fichierRecrutement = foundFichierRecrutement.map((currFichier) => currFichier.dataValues)
		fichierRecrutement = fichierRecrutement.map((currFichier) => {
			currFichier.requiredLink = `/dossierRecrutement/delete/${dossierRecrutement.id}/file/${currFichier.id}`
			return currFichier
		})

		const [{ dataValues: foundFichePoste }] = await FichePoste.findAll({
			where: {
				id: foundCandidature[0].dataValues.fichePosteId,
			},
		})

		params.fichierRecrutement = fichierRecrutement
		params.dossierRecrutementId = dossierRecrutement.id
		params.createDossierLink = `/dossierRecrutement/addfile/${dossierRecrutement.id}`
		params.sendMailLink = `/dossierRecrutement/sendmail/${dossierRecrutement.id}`
		params.countFiles = fichierRecrutement.length
	} else {
		const createdDossierRecrutement = await DossierRecrutement.create({
			candidatureId: candidatureId,
		})

		if (createdDossierRecrutement) {
			dossierRecrutement = createdDossierRecrutement.dataValues
			params.dossierRecrutementId = dossierRecrutement.id
			params.createDossierLink = `/dossierRecrutement/addfile/${dossierRecrutement.id}`
			params.countFiles = 0
		} else {
			res.redirect('/')
			return 0
		}
	}

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

	res.render('dossierRecrutementCreatePage', {
		layout: 'mainWorkspaceSidebar',
		...params,
	})
}
