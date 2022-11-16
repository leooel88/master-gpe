const { FichePoste } = require('@models')

exports.process = async (req, res, next) => {
	const fichePosteId = parseInt(req.params.fichePosteId, 10)
	const updatedRows = await FichePoste.update(
		{
			validationRH: 1,
		},
		{
			where: { id: fichePosteId },
		},
	)
	res.redirect(`/fichePoste/read/${fichePosteId}`)
}
