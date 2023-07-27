const graph = require('@utils/azureService/graph.js')
const zonedTimeToUtc = require('date-fns-tz/zonedTimeToUtc')
const addDays = require('date-fns/addDays')
const startOfWeek = require('date-fns/startOfWeek')
const iana = require('windows-iana')

exports.process = async (req, res, next) => {
	const { error } = req.query

	const params = {
		active: { dashboard: true },
	}
	if (error != null && error.length > 0) {
		params.error = [{ message: error }]
	}

	// Get the user
	const user = req.app.locals.users[req.session.userId]
	const timeZoneId = iana.findIana(user.timeZone)[0]
	const weekStart = zonedTimeToUtc(startOfWeek(new Date()), timeZoneId.valueOf())
	const weekEnd = addDays(weekStart, 1)

	// params.events = events
	const { userId } = req.session
	params.userId = userId
	const userDetails = await graph.getUserDetails(req.app.locals.msalClient, userId)
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
