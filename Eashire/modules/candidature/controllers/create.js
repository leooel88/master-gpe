const { Candidature } = require('@models')
const errorHandler = require('@utils/errorHandler')

exports.process = (req, res) => {
	console.log('in create candidature')
	console.log(req.body.candidature_nom)
	console.log(req.body.candidature_prenom)
	console.log(req.body.candidature_telephone)
	console.log(req.body.ficheposteid)

	// Validate request
	if (
		!req.body.candidature_nom ||
		!req.body.candidature_prenom ||
		!req.body.candidature_telephone ||
		!req.body.ficheposteid ||
		!req.body.fileName
	) {
		errorHandler.sendInvalidBodyError(res, `candidature/create/${req.body.ficheposteid}`)
		return
	}
	// Create a Tutorial
	const candidature = {
		nom: req.body.candidature_nom,
		prenom: req.body.candidature_prenom,
		telephone: req.body.candidature_telephone,
		fichePosteId: req.body.ficheposteid,
		mail: req.body.candidature_mail,
		cv: req.body.fileName,
	}
	let params = {}
	// Save Tutorial in the database
	Candidature.create(candidature)
		.then((data) => {
			console.log(data)
			params = { active: { home: true }, createdCandidature: true }
			res.render('home', params)
		})
		.catch((err) => {
			console.log('ERROR : ')
			console.log(err)
			errorHandler.catchDataCreationError(
				err.errors,
				res,
				`candidature/create/${req.body.ficheposteid}`,
			)
		})
}
