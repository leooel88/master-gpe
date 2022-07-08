const { locals } = require('../app');
const errorHandler = require('../helper/errorHandler');
const graph = require('../azureService/graph.js');
require('dotenv').config({ path: `azure.config.env` });
const addDays = require('date-fns/addDays');
const formatISO = require('date-fns/formatISO');
const startOfWeek = require('date-fns/startOfWeek');
const zonedTimeToUtc = require('date-fns-tz/zonedTimeToUtc');
const iana = require('windows-iana');

exports.getPage = async (req, res, next) => {
	if (!req.session.userId) {
		// Redirect unauthenticated requests to home page
		res.redirect('/auth/signin');
	} else {
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
		console.log('EVENTS : ');
		console.log(events);

		let groups;
		console.log('OUIIIIIIIIIIIIIIIIIIIII');
		console.log(process.env.GROUP_RH_NAME);
		groups = await graph
			.getGroups(req.app.locals.msalClient, req.session.userId, [
				process.env.GROUP_RH_NAME,
				process.env.GROUP_MANAGER_NAME,
			])
			.then(() => {
				console.log('GROUPES : ');
				console.log(groups);
			});

		const userDetails = await graph.getUserDetails(
			req.app.locals.msalClient,
			req.session.userId
		);
		console.log('USER DETAILS : ');
		console.log(userDetails);

		// res.render('dashboard', params);
	}
};
