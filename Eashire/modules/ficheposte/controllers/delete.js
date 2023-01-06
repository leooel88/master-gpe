const { FichePoste } = require('@models')

exports.process = (req, res) => {
	const fichePosteId = parseInt(req.params.fichePosteId, 10)

	FichePoste.destroy({
		where: { id: fichePosteId },
	}).then(() => {
		res.redirect('/ficheposte/list')
	})
}
