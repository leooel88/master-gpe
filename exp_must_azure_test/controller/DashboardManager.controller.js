const errorHandler = require('../helper/errorHandler');

const loggerHandler = require('../helper/loggerHandler');

exports.getPage = async (req, res, next) => {
	if (loggerHandler.checkLoggedIn(req, res) === false) {
		return;
	}

	let { error } = req.query;

	let params = {
		active: { dashboardManager: true },
	};

	res.render('dashboardManager', params);
};
