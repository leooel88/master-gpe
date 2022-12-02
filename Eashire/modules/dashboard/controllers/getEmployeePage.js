exports.process = async (req, res, next) => {
	const { error } = req.query
	const params = {}

	if (error != null && error.length > 0) {
		params.error = [{ message: error }]
	}

	params.organigramme = '/organigramme'

	res.render('employeePage', params)
}
