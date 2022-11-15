const loggerHandler = require('../../../utils/loggerHandler')

exports.process = (req, res, next) => {
	if (loggerHandler.checkLoggedInRedirectSignInIfNot(req, res) === false) {
		return
	}

	const { error } = req.query

	const params = {
		active: { fichePoste: true },
		currentDate: new Date().toISOString().split('T')[0],
	}
	if (error != null && error.length > 0) {
		params.error = [{ message: error }]
	}
	console.log('==========================')
	console.log(params)
	res.render('fichePoste', params)
}
