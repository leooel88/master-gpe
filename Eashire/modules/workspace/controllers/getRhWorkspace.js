const { FichePoste } = require('@models')
const loggerHandler = require('@utils/loggerHandler')

exports.process = async (req, res, next) => {
	if (loggerHandler.checkLoggedInRedirectSignInIfNot(req, res) === false) {
		return
	}

	const nbrFichePosteWaiting = await FichePoste.count({
		where: { validationRh: 0 },
	})

	const { error } = req.query

	const params = {
		active: { dashboardRh: true },
		nbrWaiting: nbrFichePosteWaiting,
	}

	res.render('dashboardRh', params)
}
