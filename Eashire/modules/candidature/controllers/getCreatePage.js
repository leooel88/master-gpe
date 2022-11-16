const { FichePoste } = require('@models')
const errorHandler = require('@utils/errorHandler')

exports.process = (req, res, next) => {
	const fichePosteId = parseInt(req.params.fichePosteId, 10)

	let params = {}

	FichePoste.findAll({
		where: {
			id: fichePosteId,
		},
	})
		.then((foundFichePoste) => {
			params = {
				active: { fichePosteRead: true },
				fichePoste: foundFichePoste[0].dataValues,
				fichePosteLink: `/ficheposte/read/${foundFichePoste[0].dataValues.id}`,
				candidateLink: '/candidature/create',
			}
			res.render('candidature', params)
		})
		.catch((err) => {
			errorHandler.catchDataCreationError(err.errors, res, 'fichePosteList')
		})
}
