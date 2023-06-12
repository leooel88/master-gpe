const azureService = require('@utils/azureService/graph')
const errorHandler = require('@utils/errorHandler')
const jwt = require('jsonwebtoken')

const url = require('url')

exports.process = async (req, res, next) => {
	const params = {}

	params.users = (await azureService.getUsers(req.app.locals.msalClient, req.session.userId)).value

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

	res.render('listUser', {
		layout: 'mainWorkspaceSidebar',
		...params,
	})
}
