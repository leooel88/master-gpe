exports.process = async (req, res, next) => {
	const { error } = req.query

	const params = {
		active: { dashboardManager: true },
	}

	res.render('dashboardFinance', params)
}
