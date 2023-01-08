const { FichePoste, Candidature } = require('@models')

exports.process = async (req, res) => {
	const fichePosteId = parseInt(req.params.fichePosteId, 10)

	await Candidature.destroy({ where: { fichePosteId: fichePosteId } })

	await FichePoste.update(
		{
			archived: 1,
		},
		{ where: { id: fichePosteId } },
	)

	res.redirect('/ficheposte/list')
}
