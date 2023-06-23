const azureService = require('@utils/azureService/graph')
const jwt = require('jsonwebtoken')

exports.process = async (req, res, next) => {
	const params = {}

	const manager = await azureService.getManager(req.app.locals.msalClient, req.session.userId)

	const directReports = await azureService.getDirectReports(
		req.app.locals.msalClient,
		req.session.userId,
	)

	const coworker = await azureService.getCoworker(req.app.locals.msalClient, req.session.userId)

	params.manager = manager
	params.directReports = directReports.value
	params.coworker = coworker.value

	const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
	const { userId, rh: isRh, manager: isManager, finance: isFinance, it: isIt } = decodedToken
	params.userId = userId

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

	res.render('organigramme', {
		layout: 'mainWorkspaceSidebar',
		...params,
	})
}
