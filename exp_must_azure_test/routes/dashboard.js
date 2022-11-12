const router = require('express-promise-router')();

const dashboardController = require('../controller/Dashboard.js');
const managerDashboardController = require('../controller/DashboardManager.controller.js');
const rhDashboardController = require('../controller/DashboardRh.controller.js')

const financeDashboardController = require('../controller/DashboardFinance.controller.js');

router.get('/employee', dashboardController.getEmployeePage);
router.get('/', dashboardController.getPage);
router.get('/manager', managerDashboardController.getPage);
router.get('/finance', financeDashboardController.getPage);
router.get('/rh', rhDashboardController.getPage);

router.get('/default', function (req, res, next) {
	let params = {
		active: { dashboardDefault: true },
	};

	res.render('dashboardDefault', params);
});

module.exports = router;
