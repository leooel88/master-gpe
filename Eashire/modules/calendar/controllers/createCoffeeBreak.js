const graph = require('@utils/azureService/graph.js')
const jwt = require('jsonwebtoken')
const moment = require('moment')

exports.process = async (req, res) => {
	const inputs = req.body
	console.log(inputs)

	try {
		validateRequest(inputs)
	} catch (error) {
		console.log(error)
		res.redirect('/')
	}

	const dateTimeString = `${inputs['event-date']} ${inputs['event-time']}`
	const startDate = moment(dateTimeString, 'DD/MM/YYYY HH:mm')
	const endDate = startDate.clone().add(parseInt(inputs['event-duration'].split('_')[2]), 'minutes')

	// Check if dates are valid
	if (!startDate.isValid() || !endDate.isValid()) {
		throw new Error('Invalid date or time format')
	}

	const attendees = inputs.selectedUsers.map((email) => {
		return {
			emailAddress: {
				address: email,
			},
			type: 'required',
		}
	})

	const event = {
		subject: 'Pause café', // Use the provided event description as the subject
		body: {
			contentType: 'HTML',
			content: 'Join us for a coffee break',
		},
		start: {
			dateTime: startDate.toISOString(),
			timeZone: 'Pacific Standard Time',
		},
		end: {
			dateTime: endDate.toISOString(),
			timeZone: 'Pacific Standard Time',
		},
		location: {
			displayName: 'Coffee Break',
		},
		attendees: attendees,
	}

	const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
	const { userId, rh: isRh, manager: isManager, finance: isFinance, it: isIt } = decodedToken

	const createdEvent = await graph.createEvent(req.app.locals.msalClient, userId, event)

	res.redirect('/calendar')
}

function validateRequest(reqBody) {
	// Ensure all required parameters exist
	if (
		!reqBody['event-date'] ||
		!reqBody['event-time'] ||
		!reqBody['event-duration'] ||
		!reqBody.selectedUsers
	) {
		throw new Error('Missing required parameters.')
	}

	// Ensure event-date is a valid date
	const dateParts = reqBody['event-date'].split('/') // This will give you an array like ["27", "07", "2023"]
	const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]) // Note: JavaScript counts months from 0 (January) to 11 (December), hence dateParts[1] - 1

	if (isNaN(date)) {
		throw new Error('Invalid date.')
	}

	// Ensure event-time is a valid time
	const time = reqBody['event-time']
	const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
	if (!timeRegex.test(time)) {
		throw new Error('Invalid time.')
	}

	// Ensure event-duration is one of the specified options
	const validDurations = [
		'event_duration_5',
		'event_duration_10',
		'event_duration_15',
		'event_duration_20',
		'event_duration_30',
	]
	if (!validDurations.includes(reqBody['event-duration'])) {
		throw new Error('Invalid duration.')
	}

	// Ensure selectedUsers contains at least one user
	if (reqBody.selectedUsers.length < 1) {
		throw new Error('No users selected.')
	}
}
