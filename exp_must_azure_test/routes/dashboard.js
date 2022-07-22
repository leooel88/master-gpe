const router = require('express-promise-router')();

const dashboardController = require('../controller/Dashboard.js');
const managerDashboardController = require('../controller/DashboardManager.controller.js');

router.get('/', dashboardController.getPage);

router.get('/manager', managerDashboardController.getPage);

router.get('/rh', function (req, res, next) {
	let params = {
		active: { dashboardRh: true },
	};

	res.render('dashboardRh', params);
});

router.get('/finance', function (req, res, next) {
	let params = {
		active: { dashboardFinance: true },
	};

	res.render('dashboardFinance', params);
});

router.get('/default', function (req, res, next) {
	let params = {
		active: { dashboardDefault: true },
	};

	res.render('dashboardDefault', params);
});

module.exports = router;
