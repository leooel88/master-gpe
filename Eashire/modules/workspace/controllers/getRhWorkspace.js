const { FichePoste } = require('@models')

exports.process = async (req, res, next) => {
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
