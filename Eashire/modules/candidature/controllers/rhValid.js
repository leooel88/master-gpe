const { Candidature } = require('@models')

exports.process = async (req, res, next) => {
	console.log('==================================')
	console.log('==================================')
	console.log('==================================')
	console.log('==================================')
	console.log('==================================')

	const candidatureId = parseInt(req.params.candidatureId, 10)
	const updatedRows = await Candidature.update(
		{
			validationRh: 1,
		},
		{
			where: { id: candidatureId },
		},
	)
	res.redirect(`/candidature/read/${candidatureId}`)
}
