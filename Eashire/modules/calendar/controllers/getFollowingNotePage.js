const graph = require('@utils/azureService/graph.js')
const jwt = require('jsonwebtoken')

exports.process = async (req, res, next) => {
	const { eventId } = req.params
	console.log('=========================')
	console.log(eventId)
}
