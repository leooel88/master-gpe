const db = require('../../../database/models')
const errorHandler = require('../../../utils/errorHandler')
const loggerHandler = require('../../../utils/loggerHandler')
const { Op } = db.Sequelize
const { FichePoste } = db

exports.getPage = async (req, res, next) => {
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
