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

module.exports = router
