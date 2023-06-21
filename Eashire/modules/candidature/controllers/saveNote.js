const { Candidature } = require('@models')
const azureService = require('@utils/azureService/graph')

exports.process = async (req, res, next) => {
	const candidatureId = parseInt(req.params.candidatureId, 10)
	const newNote = req.body['text-area']

	const groups = await azureService.getMainGroups(req.app.locals.msalClient, req.session.userId)

	if (groups.includes('RH')) {
		await Candidature.update(
			{
				rhComment: newNote,
			},
			{ where: { id: candidatureId } },
		)
		res.redirect(`/candidature/read/${candidatureId}/?notes=true&tab=rh`)
	} else if (groups.includes('MANAGER')) {
		await Candidature.update(
			{
				managerComment: newNote,
			},
			{ where: { id: candidatureId } },
		)
		res.redirect(`/candidature/read/${candidatureId}/?notes=true&tab=manager`)
	} else {
		res.redirect('/')
	}
}
