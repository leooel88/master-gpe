const azureService = require('@utils/azureService/graph')
const errorHandler = require('@utils/errorHandler')

const url = require('url')

exports.process = async (req, res, next) => {
	const params = {}

	const users = await azureService.getUsers(req.app.locals.msalClient, req.session.userId)

	res.render('listUser', {
		users: users.value,
	})
}
