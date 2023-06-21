const _module = require('@dashboard')
const auth = require('@utils/authentication')
const router = require('express-promise-router')()

const dashboardController = _module.controller

router.get('/employee', auth.authenticated, dashboardController.getEmployeePage)
router.get('/', auth.authenticated, dashboardController.getPage)

module.exports = router
