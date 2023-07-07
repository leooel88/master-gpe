const _module = require('@calendar')
const auth = require('@utils/authentication')
const graph = require('@utils/azureService/graph.js')
const zonedTimeToUtc = require('date-fns-tz/zonedTimeToUtc')
const addDays = require('date-fns/addDays')
const formatISO = require('date-fns/formatISO')
const startOfWeek = require('date-fns/startOfWeek')
const router = require('express-promise-router')()
const iana = require('windows-iana')

const calendarController = _module.controller

router.get('/', auth.authenticated, calendarController.getRootPage)

router.get('/coffeebreak', auth.authenticated, calendarController.getCoffeeBreakPage)

router.post('/coffeebreak/create', auth.authenticated, calendarController.createCoffeeBreak)

router.get('/suivi', auth.authenticatedGroups(['RH', 'MANAGER']), calendarController.getSuiviPage)

router.post(
	'/suivi/create',
	auth.authenticatedGroups(['RH', 'MANAGER']),
	calendarController.createSuivi,
)

router.get(
	'/interview',
	auth.authenticatedGroups(['RH', 'MANAGER']),
	calendarController.getInterviewPage,
)

router.post(
	'/interview/create',
	auth.authenticatedGroups(['RH', 'MANAGER']),
	calendarController.createInterview,
)

module.exports = router
