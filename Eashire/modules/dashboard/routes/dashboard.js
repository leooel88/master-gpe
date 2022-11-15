const router = require('express-promise-router')()

const dashboardController = require('../controllers/Dashboard.js')
const financeDashboardController = require('../controllers/DashboardFinance.controller.js')
const managerDashboardController = require('../controllers/DashboardManager.controller.js')
const rhDashboardController = require('../controllers/DashboardRh.controller.js')

router.get('/employee', dashboardController.getEmployeePage)
router.get('/', dashboardController.getPage)
router.get('/manager', managerDashboardController.getPage)
router.get('/finance', financeDashboardController.getPage)
router.get('/rh', rhDashboardController.getPage)

router.get('/default', function (req, res, next) {
	const params = {
		active: { dashboardDefault: true },
	}

	res.render('dashboardDefault', params)
})

module.exports = router
