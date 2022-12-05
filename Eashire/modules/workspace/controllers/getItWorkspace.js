exports.process = async (req, res, next) => {
	const { error } = req.query

	const params = {
		active: { dashboardIt: true },
	}

	res.render('dashboardIt', params)
}
