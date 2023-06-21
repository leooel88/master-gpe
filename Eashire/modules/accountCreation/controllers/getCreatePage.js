const { Candidature, FichePoste } = require('@models')
const jwt = require('jsonwebtoken')

exports.process = async (req, res) => {
	const candidatureId = parseInt(req.params.candidatureId, 10)
	const foundCandidature = await Candidature.findAll({ where: { id: candidatureId } })

	if (
		!foundCandidature ||
		!foundCandidature.length > 0 ||
		foundCandidature[0].dataValues.accepted != 1
	) {
		res.redirect('/')
		return 0
	}
	if (foundCandidature[0].dataValues.accountDemand != null) {
		res.redirect('/')
		return 0
	}

	const foundFichePoste = await FichePoste.findAll({
		where: { id: foundCandidature[0].dataValues.fichePosteId },
	})

	if (!foundFichePoste || !foundFichePoste.length > 0) {
		res.redirect('/')
		return 0
	}

	const params = {
		active: { accountCreationDemandCreationPage: true },
		candidatureId: candidatureId,
		candidature: foundCandidature[0].dataValues,
		fichePoste: foundFichePoste[0].dataValues,
		candidatureLink: `/candidature/read/${candidatureId}`,
		createLink: `/accountcreationdemand/create/${candidatureId}`,
	}

	const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
	const { userId, rh: isRh, manager: isManager, finance: isFinance, it: isIt } = decodedToken

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

	res.render('accountCreationDemandCreationPage', {
		layout: 'mainWorkspaceSidebar',
		...params,
	})
}
