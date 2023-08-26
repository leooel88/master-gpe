const { Candidature, FichePoste } = require('@models')
const graph = require('@utils/azureService/graph.js')
const jwt = require('jsonwebtoken')
const { isNull } = require('url/util')

exports.process = async (req, res, next) => {
	const params = {
		interviewCreateLink: '/calendar/interview/create',
	}
	const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
	const { userId, rh: isRh, manager: isManager, finance: isFinance, it: isIt } = decodedToken
	let users

	if (isRh == true) {
		params.rh = true
		users = await Candidature.findAll({
			where: { accepted: 0, accountDemand: null },
		})
		users = users.map((user) => user.dataValues)
	}
	if (isManager == true) {
		params.manager = true
		users = await Candidature.findAll({
			where: { validationRh: 1, accepted: 0, accountDemand: null },
		})
		users = users.map((user) => user.dataValues)
	}
	if (isFinance == true) {
		params.finance = true
	}
	if (isIt == true) {
		params.it = true
	}

	const userArray = []

	for (const user of users) {
		const { dataValues: fichePoste } = await FichePoste.findOne({
			where: { id: user.fichePosteId },
		})
		userArray.push({ ...user, jobLabel: fichePoste.label })
	}

	params.userArray = userArray

	res.render('interviewCreationPage', {
		layout: 'mainCalendarWithSidebar',
		...params,
	})
}
