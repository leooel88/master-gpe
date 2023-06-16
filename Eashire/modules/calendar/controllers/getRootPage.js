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

	const user = req.app.locals.users[req.session.userId]

	const { value } = await graph.getCalendarNEvents(
		req.app.locals.msalClient,
		userId,
		20,
		user.timeZone,
	)
	let events = value.map((event) => ({
		...event,
		eventHour: new Date(event.start.dateTime).toLocaleTimeString('fr-FR', {
			hour: '2-digit',
			minute: '2-digit',
		}),
		organizerName: event.organizer.emailAddress.name,
	}))
	events = events.sort((a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime))
	events.forEach((event) => {
		const startDisplayDate = formatDate(event.start.dateTime)
		const endDisplayTime = formatDate(event.end.dateTime).split(' . ')[1] // We only need the time part for the end date.
		event.displayDates = `${startDisplayDate} - ${endDisplayTime}`
	})
	events.forEach((event) => {
		if (event.attendees && event.attendees.length > 0) {
			event.attendees[0].isFirst = true
		}
	})

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

	res.render('calendar', {
		layout: 'mainCalendarWithSidebar.handlebars',
		...params,
	})
}

// function getEventListWithAllDates(events) {
// 	const result = []
// 	const options = { weekday: 'long', month: 'long', day: 'numeric' }

// 	// Get the first and last event dates
// 	const firstEventDate = new Date(events[0].start.dateTime)
// 	const lastEventDate = new Date(events[events.length - 1].start.dateTime)

// 	// Get rid of the hours, minutes and seconds for the comparison
// 	firstEventDate.setHours(0, 0, 0, 0)
// 	lastEventDate.setHours(0, 0, 0, 0)

// 	const currentDate = new Date(firstEventDate)

// 	let currentEventIndex = 0
// 	let count = 0

// 	// eslint-disable-next-line no-unmodified-loop-condition
// 	while (currentDate <= lastEventDate) {
// 		let dateString = currentDate.toLocaleDateString('fr-FR', options)
// 		// Capitalize each word in the date string
// 		dateString = dateString.replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())

// 		if (currentEventIndex == 0) {
// 			result.push({
// 				separator: true,
// 				first: true,
// 				date: dateString,
// 			})
// 			count++
// 		} else {
// 			if (result[count - 1].separator == true) {
// 				result[count - 1].empty = true
// 			}
// 			result.push({
// 				separator: true,
// 				date: dateString,
// 			})
// 			count++
// 		}

// 		while (currentEventIndex < events.length) {
// 			const currentEventDate = new Date(events[currentEventIndex].start.dateTime)
// 			currentEventDate.setHours(0, 0, 0, 0)

// 			if (currentDate.getTime() === currentEventDate.getTime()) {
// 				result.push(events[currentEventIndex])
// 				count++
// 				currentEventIndex++
// 			} else {
// 				break
// 			}
// 		}

// 		// Increment the current date by 1 day
// 		currentDate.setDate(currentDate.getDate() + 1)
// 	}
// 	return result
// }

function formatDate(dateString) {
	const date = new Date(dateString)

	// Get the day of the week, date, and month in French.
	const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
	const dayOfWeek = daysOfWeek[date.getUTCDay()]
	const day = date.getUTCDate()
	const months = [
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
	const month = months[date.getUTCMonth()]

	// Format the time in 24-hour format.
	const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

	return `${dayOfWeek} ${day} ${month} . ${time}`
}
