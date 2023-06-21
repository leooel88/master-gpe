const { FichePoste, Candidature } = require('@models')

exports.process = async (req, res) => {
	const fichePosteId = parseInt(req.params.fichePosteId, 10)

	await Candidature.destroy({ where: { fichePosteId: fichePosteId } })

	await FichePoste.destroy({
		where: { id: fichePosteId },
	}).then(() => {
		res.redirect('/ficheposte/list')
	})
}
