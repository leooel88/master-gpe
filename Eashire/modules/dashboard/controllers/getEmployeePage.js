const jwt = require('jsonwebtoken')

exports.process = async (req, res, next) => {
	const { error } = req.query
	const params = {}

	if (error != null && error.length > 0) {
		params.error = [{ message: error }]
	}

	params.organigramme = '/organigramme'

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

	res.render('employeePage', {
		layout: 'mainWorkspaceSidebar',
		...params,
	})
}
