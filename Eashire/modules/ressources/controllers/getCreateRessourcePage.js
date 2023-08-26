const graph = require('@utils/azureService/graph.js')
const jwt = require('jsonwebtoken')

exports.process = async (req, res) => {
	const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
	const { userId, rh: isRh, manager: isManager, finance: isFinance, it: isIt } = decodedToken
	const params = {
		createRessourceLink: `/ressources/create`,
	}

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
	console.log('#################################')
	console.log('#################################')
	console.log('#################################')
	console.log('FOUND USERS')
	console.log(users)
	params.userArray = users

	const { value: groups } = await graph.getGroups(req.app.locals.msalClient, req.session.userId)
	console.log('#################################')
	console.log('#################################')
	console.log('#################################')
	console.log('FOUND GROUPS')
	console.log(groups)
	params.groupArray = groups

	res.render('ressourceCreatePage', {
		layout: 'mainRessourcesWithSidebar',
		...params,
	})
}
