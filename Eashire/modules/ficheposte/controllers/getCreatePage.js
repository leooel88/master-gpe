const jwt = require('jsonwebtoken')

exports.process = (req, res, next) => {
	const { error } = req.query

	const params = {
		active: { fichePoste: true },
		currentDate: new Date().toISOString().split('T')[0],
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

	if (error != null && error.length > 0) {
		params.error = [{ message: error }]
	}
	res.render('fichePoste', {
		layout: 'mainWorkspaceSidebar',
		...params,
	})
}
