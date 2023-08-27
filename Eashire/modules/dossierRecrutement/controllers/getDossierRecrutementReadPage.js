const { DossierRecrutement, FichierRecrutement, Candidature, FichePoste } = require('@models')
const jwt = require('jsonwebtoken')

const { ADMIN_FILES_BASE_PATH } = process.env

exports.process = async (req, res) => {
	const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
	const { userId, rh: isRh, manager: isManager, finance: isFinance, it: isIt } = decodedToken
	const params = {}
	params.userId = userId

	if (isRh == true) {
		params.rh = true
	}

	const { dataValues: dossierRecrutement } = await DossierRecrutement.findOne({
		where: { id: req.params.dossierRecrutementId },
	})
	params.dossierRecrutement = dossierRecrutement
	const fichierRecrutementData = await FichierRecrutement.findAll({
		where: { dossierRecrutementId: req.params.dossierRecrutementId },
	})
	params.fichiersRecrutement = fichierRecrutementData.map((fichier) => {
		const result = fichier.dataValues
		result.fileLink = `${ADMIN_FILES_BASE_PATH}/${dossierRecrutement.directoryId}/${fichier.fileName}`
		return result
	})
	const { dataValues: candidature } = await Candidature.findOne({
		where: { id: dossierRecrutement.candidatureId },
	})
	params.candidature = candidature
	params.candidatureLink = `/candidature/read/${candidature.id}`
	const { dataValues: ficheposte } = await FichePoste.findOne({
		where: { id: candidature.fichePosteId },
	})
	params.ficheposte = ficheposte
	params.ficheposteLink = `/ficheposte/read/${candidature.fichePosteId}`

	res.render('dossierRecrutementReadPage', {
		layout: 'mainWorkspaceSidebar',
		...params,
	})
}
