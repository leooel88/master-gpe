const graph = require('@utils/azureService/graph.js')
const zonedTimeToUtc = require('date-fns-tz/zonedTimeToUtc')
const addDays = require('date-fns/addDays')
const startOfWeek = require('date-fns/startOfWeek')
const jwt = require('jsonwebtoken')
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
	const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
	const {
		userId: userId_,
		rh: isRh,
		manager: isManager,
		finance: isFinance,
		it: isIt,
	} = decodedToken
	console.log('########################')
	console.log('########################')
	console.log('########################')
	console.log(decodedToken)
	params.userId = userId_

	if (isRh == true) {
		params.rh = true
	}
	if (isManager == true) {
		params.manager = true
	}
	if (isFinance == true) {
		params.finance = true
	}
	if (isIt == true) {
		params.it = true
	}

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

	const employeeHireDate = `${dt} / ${month} / ${year}`

	const userInfos = {
		jobTitle: userDetails.jobTitle,
		employeeHireDate: employeeHireDate,
	}

	params.userInfos = userInfos
	params.today = getCurrentDateInFrench()

	res.render('dashboard', params)
}

function getCurrentDateInFrench() {
	const today = new Date()

	const daysInFrench = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
	const monthsInFrench = [
		'Janvier',
		'Février',
		'Mars',
		'Avril',
		'Mai',
		'Juin',
		'Juillet',
		'Août',
		'Septembre',
		'Octobre',
		'Novembre',
		'Décembre',
	]

	const day = daysInFrench[today.getUTCDay()]
	const dayNumber = today.getUTCDate().toString()
	const month = monthsInFrench[today.getUTCMonth()]
	const year = today.getUTCFullYear()

	return {
		day,
		dayNumber,
		month,
		year,
	}
}
