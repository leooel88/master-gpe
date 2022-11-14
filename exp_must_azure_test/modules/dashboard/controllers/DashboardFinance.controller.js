const errorHandler = require('../../../utils/errorHandler');

const loggerHandler = require('../../../utils/loggerHandler');

exports.getPage = async (req, res, next) => {
	if (loggerHandler.checkLoggedInRedirectSignInIfNot(req, res) === false) {
		return;
	}

	let { error } = req.query;

	let params = {
		active: { dashboardManager: true },
	};

	res.render('dashboardFinance', params);
};
