const graph = require('@utils/azureService/graph.js')
const jwt = require('jsonwebtoken')

exports.process = async (req, res, next) => {
	const params = {
		coffeeBreakCreateLink: '',
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

	res.render('coffeeBreakCreationPage', {
		layout: 'mainCalendarWithSidebar.handlebars',
		...params,
	})
}
