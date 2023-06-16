const graph = require('@utils/azureService/graph.js')
const jwt = require('jsonwebtoken')

exports.process = async (req, res, next) => {
	const { error } = req.query
	const params = {}

	if (error != null && error.length > 0) {
		params.error = [{ message: error }]
	}

	const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
	const { userId, rh: isRh, manager: isManager, finance: isFinance, it: isIt } = decodedToken

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

	const { value } = await graph.getCalendarNEvents(req.app.locals.msalClient, userId, 20)
	let events = value.map((event) => ({
		...event,
		eventHour: new Date(event.start.dateTime).toLocaleTimeString('fr-FR', {
			hour: '2-digit',
			minute: '2-digit',
		}),
		organizerName: event.organizer.emailAddress.name,
	}))
	events = events.sort((a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime))

	const options = { weekday: 'long', month: 'long', day: 'numeric' }
	const paramsEvents = []

	for (let i = 0; i < events.length; i++) {
		if (i == 0) {
			const currentEventDate = new Date(events[i].start.dateTime)
			let dateString = currentEventDate.toLocaleDateString('fr-FR', options)
			// Capitalize each word in the date string
			dateString = dateString.replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())

			paramsEvents.push({
				separator: true,
				first: true,
				date: dateString,
			})
		}

		paramsEvents.push(events[i])

		if (i < events.length - 1) {
			const currentEventDate = new Date(events[i].start.dateTime)
			const nextEventDate = new Date(events[i + 1].start.dateTime)

			if (currentEventDate.getDate() !== nextEventDate.getDate()) {
				let dateString = nextEventDate.toLocaleDateString('fr-FR', options)
				// Capitalize each word in the date string
				dateString = dateString.replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())

				paramsEvents.push({
					separator: true,
					date: dateString,
				})
			}
		}
	}

	params.events = paramsEvents
	console.log(paramsEvents)

	res.render('calendar', {
		layout: 'mainCalendarWithSidebar.handlebars',
		...params,
	})
}
