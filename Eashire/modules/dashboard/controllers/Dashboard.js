const zonedTimeToUtc = require('date-fns-tz/zonedTimeToUtc')
const addDays = require('date-fns/addDays')
const formatISO = require('date-fns/formatISO')
const startOfWeek = require('date-fns/startOfWeek')
const iana = require('windows-iana')

const graph = require('../../../utils/azureService/graph.js')
const errorHandler = require('../../../utils/errorHandler')
const loggerHandler = require('../../../utils/loggerHandler')

exports.getPage = async (req, res, next) => {
	if (loggerHandler.checkLoggedInRedirectSignInIfNot(req, res) === false) {
		return
	}

	const { error } = req.query

	const params = {
		active: { dashboard: true },
	}
	if (error != null && error.length > 0) {
		params.error = [{ message: error }]
	}

	// Get the user
	const user = req.app.locals.users[req.session.userId]
	// Convert user's Windows time zone ("Pacific Standard Time")
	// to IANA format ("America/Los_Angeles")
	console.log(user)
	const timeZoneId = iana.findIana(user.timeZone)[0]
	console.log(`Time zone: ${timeZoneId.valueOf()}`)

	// Calculate the start and end of the current week
	// Get midnight on the start of the current week in the user's timezone,
	// but in UTC. For example, for Pacific Standard Time, the time value would be
	// 07:00:00Z
	const weekStart = zonedTimeToUtc(startOfWeek(new Date()), timeZoneId.valueOf())
	const weekEnd = addDays(weekStart, 1)
	console.log(`Start: ${weekStart.toISOString()}`)

	// Get events
	const events = await graph.getCalendarView(
		req.app.locals.msalClient,
		req.session.userId,
		weekStart.toISOString(),
		weekEnd.toISOString(),
		user.timeZone,
		2,
	)

	params.events = events

	const groups = await graph.getMainGroups(req.app.locals.msalClient, req.session.userId)

	if (groups.includes('RH')) {
		console.log('============ RH ============')
		params.dashboardLink = '/workspace/rh'
	} else if (groups.includes('MANAGER')) {
		console.log('============ MANAGER ============')
		params.dashboardLink = '/workspace/manager'
	} else if (groups.includes('FINANCE')) {
		console.log('============ FINANCE ============')
		params.dashboardLink = '/workspace/finance'
	} else {
		console.log('============ DEFAULT ============')
		params.dashboardLink = '/workspace/default'
	}

	const userDetails = await graph.getUserDetails(req.app.locals.msalClient, req.session.userId)
	const date = new Date(userDetails.employeeHireDate)
	const year = date.getFullYear()
	let month = date.getMonth() + 1
	let dt = date.getDate()

	if (dt < 10) {
		dt = `0${dt}`
	}
	if (month < 10) {
		month = `0${month}`
	}

	const employeeHireDate = `${dt} ${month} ${year}`

	const userInfos = {
		jobTitle: userDetails.jobTitle,
		employeeHireDate: employeeHireDate,
	}

	params.userInfos = userInfos

	res.render('dashboard', params)
}

exports.getEmployeePage = async (req, res, next) => {
	const isLoggedIn = loggerHandler.checkLoggedIn(req)

	const { error } = req.query
	const params = {}

	if (error != null && error.length > 0) {
		params.error = [{ message: error }]
	}

	params.organigramme = '/organigramme'

	res.render('employeePage', params)
	// .catch((err) => {
	// 	console.log('ERROR : ');
	// 	console.log(err);
	// 	errorHandler.catchDataCreationError(
	// 		err.errors,
	// 		res,
	// 		'fichePosteList'
	// 	);
	//
	// 	return;
	// });
}
