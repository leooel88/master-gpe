const {
	Candidature,
	DossierRecrutement,
	FichierRecrutement,
	DossierRecrutementJoinFichierRecrutement,
} = require('@models')
const Sequelize = require('sequelize')

const { Op } = Sequelize

exports.process = async (req, res) => {
	const dossierId = parseInt(req.params.dossierRecrutementId, 10)
	const fichierId = parseInt(req.params.fichierRecrutementId, 10)

	const deletedFichierRecrutement = await FichierRecrutement.destroy({ where: { id: fichierId } })
	const foundDossierRecrutement = await DossierRecrutement.findAll({ where: { id: dossierId } })
	res.redirect(`/dossierRecrutement/create/${foundDossierRecrutement[0].dataValues.candidatureId}`)
}
