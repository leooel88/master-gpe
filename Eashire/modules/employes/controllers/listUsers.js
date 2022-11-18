const azureService = require('@utils/azureService/graph')
const errorHandler = require('@utils/errorHandler')
const loggerHandler = require('@utils/loggerHandler')

const url = require('url')

exports.getListUsers = async (req, res, next) => {
	const params = {}

	const users = await azureService.getusers(req.app.locals.msalClient, req.session.userId)

	res.render('listUser', {
		users: users.value,
	})
}
