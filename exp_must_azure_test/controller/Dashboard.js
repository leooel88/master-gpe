const errorHandler = require('../helper/errorHandler');
const graph = require('../azureService/graph.js');
const addDays = require('date-fns/addDays');
const formatISO = require('date-fns/formatISO');
const startOfWeek = require('date-fns/startOfWeek');
const zonedTimeToUtc = require('date-fns-tz/zonedTimeToUtc');
const iana = require('windows-iana');
const loggerHandler = require('../helper/loggerHandler');

exports.getPage = async (req, res, next) => {
	if (loggerHandler.checkLoggedIn(req, res) === false) {
		return;
	}

	let { error } = req.query;

	let params = {
		active: { dashboard: true },
	};
	if (error != null && error.length > 0) {
		params.error = [{ message: error }];
	}

	// Get the user
	const user = req.app.locals.users[req.session.userId];
	// Convert user's Windows time zone ("Pacific Standard Time")
	// to IANA format ("America/Los_Angeles")
	console.log(user);
	const timeZoneId = iana.findIana(user.timeZone)[0];
	console.log(`Time zone: ${timeZoneId.valueOf()}`);

	// Calculate the start and end of the current week
	// Get midnight on the start of the current week in the user's timezone,
	// but in UTC. For example, for Pacific Standard Time, the time value would be
	// 07:00:00Z
	var weekStart = zonedTimeToUtc(
		startOfWeek(new Date()),
		timeZoneId.valueOf()
	);
	var weekEnd = addDays(weekStart, 1);
	console.log(`Start: ${weekStart.toISOString()}`);

	// Get events
	const events = await graph.getCalendarView(
		req.app.locals.msalClient,
		req.session.userId,
		weekStart.toISOString(),
		weekEnd.toISOString(),
		user.timeZone,
		2
	);

	params.events = events;

	const groups = await graph.getMainGroups(
		req.app.locals.msalClient,
		req.session.userId
	);

	if (groups.includes('RH')) {
		console.log('============ RH ============');
		params.dashboardLink = '/dashboard/rh';
	} else if (groups.includes('MANAGER')) {
		console.log('============ MANAGER ============');
		params.dashboardLink = '/dashboard/manager';
	} else if (groups.includes('FINANCE')) {
		console.log('============ FINANCE ============');
		params.dashboardLink = '/dashboard/finance';
	} else {
		console.log('============ DEFAULT ============');
		params.dashboardLink = '/dashboard/default';
	}

	const userDetails = await graph.getUserDetails(
		req.app.locals.msalClient,
		req.session.userId
	);
	let date = new Date(userDetails.createdDateTime);
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let dt = date.getDate();

	if (dt < 10) {
		dt = '0' + dt;
	}
	if (month < 10) {
		month = '0' + month;
	}

	//let arrivalDate = '' + year + '\n ' + dt + '\n' + month + '';
	let arrivalDate = dt + ' ' + month + ' ' + year;


	let userInfos = {
		jobTitle: userDetails.jobTitle,
		arrivalDate: arrivalDate,
		employeeHireDate: userDetails.employeeHireDate,
	};

	params.userInfos = userInfos;

	res.render('dashboard', params);
};
