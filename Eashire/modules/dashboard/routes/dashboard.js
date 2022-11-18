const _module = require('@dashboard')
const router = require('express-promise-router')()

const dashboardController = _module.controller

router.get('/employee', dashboardController.getEmployeePage)
router.get('/', dashboardController.getPage)

module.exports = router
