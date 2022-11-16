const router = require('express-promise-router')()

const dashboardController = require('../controllers/Dashboard.js')

router.get('/employee', dashboardController.getEmployeePage)
router.get('/', dashboardController.getPage)

module.exports = router
