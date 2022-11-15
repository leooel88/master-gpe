const { FichePoste } = require('../../../database/models')

exports.process = async (req, res, next) => {
	const fichePosteId = parseInt(req.params.fichePosteId, 10)
	const updatedRows = await FichePoste.update(
		{
			validationFinance: 2,
		},
		{
			where: { id: fichePosteId },
		},
	)
	res.redirect(`/fichePoste/read/${fichePosteId}`)
}
