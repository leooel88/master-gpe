const { Candidature } = require('@models')

exports.process = async (req, res, next) => {
	const candidatureId = parseInt(req.params.candidatureId, 10)
	const updatedRows = await Candidature.update(
		{
			validationManager: 1,
		},
		{
			where: { id: candidatureId },
		},
	)
	res.redirect(`/candidature/read/${candidatureId}`)
}
