exports.process = (req, res, next) => {
	const { error } = req.query

	const params = {
		active: { fichePoste: true },
		currentDate: new Date().toISOString().split('T')[0],
	}
	if (error != null && error.length > 0) {
		params.error = [{ message: error }]
	}
	res.render('fichePoste', params)
}
