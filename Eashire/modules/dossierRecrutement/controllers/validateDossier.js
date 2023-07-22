const { DossierRecrutement, FichierRecrutement, Candidature } = require('@models')

exports.process = async (req, res) => {
	const { dataValues: dossierRecrutement } = await DossierRecrutement.findOne({
		where: { id: req.body.dossierRecrutementId },
	})

	const fichierData = await FichierRecrutement.findAll({
		where: { dossierRecrutementId: req.body.dossierRecrutementId },
	})
	const fichiersRecrutement = fichierData.map((fichier) => fichier.dataValues)

	const { dataValues: candidature } = Candidature.findOne({
		where: { id: dossierRecrutement.candidatureId },
	})

	await DossierRecrutement.update(
		{
			open: 0,
		},
		{ where: { id: req.body.dossierRecrutementId } },
	)

	await Candidature.update(
		{
			dossierRecrutement: 1,
			accepted: 1,
		},
		{ where: { id: dossierRecrutement.candidatureId } },
	)

	res.redirect(`/candidature/read/${dossierRecrutement.candidatureId}`)
}
