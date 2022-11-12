const router = require('express-promise-router')();

const dashboardController = require('../controllers/Dashboard.js');
const managerDashboardController = require('../controllers/DashboardManager.controller.js');
const rhDashboardController = require('../controllers/DashboardRh.controller.js')

const financeDashboardController = require('../controllers/DashboardFinance.controller.js');

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
