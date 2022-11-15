const errorHandler = require('../../../utils/errorHandler')
const loggerHandler = require('../../../utils/loggerHandler')

exports.getPage = async (req, res, next) => {
	if (loggerHandler.checkLoggedInRedirectSignInIfNot(req, res) === false) {
		return
	}

	const { error } = req.query

	const params = {
		active: { dashboardManager: true },
	}

	res.render('dashboardFinance', params)
}
