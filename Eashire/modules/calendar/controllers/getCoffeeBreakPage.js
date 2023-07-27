const graph = require('@utils/azureService/graph.js')
const jwt = require('jsonwebtoken')

exports.process = async (req, res, next) => {
	const params = {
		coffeeBreakCreateLink: '/calendar/coffeebreak/create',
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

	const { value: users } = await graph.getUsers(req.app.locals.msalClient, req.session.userId)
	// const { value: groups } = await graph.getGroups(req.app.locals.msalClient, req.session.userId)
	// const groupArray = []

	// for (const group of groups) {
	// 	console.log(group)
	// 	try {
	// 		const { value: members } = await graph.getGroupMembers(
	// 			req.app.locals.msalClient,
	// 			req.session.userId,
	// 			group.id,
	// 		)
	// 		groupArray.push(members)
	// 	} catch (error) {
	// 		continue
	// 	}
	// }
	// console.log(groupArray)
	params.userArray = users

	res.render('coffeeBreakCreationPage', {
		layout: 'mainCalendarWithSidebar.handlebars',
		...params,
	})
}
