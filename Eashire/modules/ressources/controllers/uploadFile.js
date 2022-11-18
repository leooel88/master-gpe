const errorHandler = require('@utils/errorHandler')

exports.create = (req, res) => {
	console.log('upload file')

	// Validate request
	if (!req.body.titre || !req.body.description || !req.body.tag) {
		errorHandler.sendInvalidBodyError(res, 'uploadFileRh')
		return
	}
	// Create a Tutorial
	const file = {
		titre: req.body.titre,
		description: req.body.description,
		tag: req.body.tag,
	}
	res.redirect('/listFile')
}
