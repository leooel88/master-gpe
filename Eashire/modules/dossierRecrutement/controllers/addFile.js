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

	const foundDossierRecrutement = await DossierRecrutement.findAll({ where: { id: dossierId } })
	if (!foundDossierRecrutement && !foundDossierRecrutement.length > 0) {
		res.redirect('/')
		return 0
	}

	if (
		!req.body.new_fichier_recrutement_title ||
		req.body.new_fichier_recrutement_title == '' ||
		!req.body.new_fichier_recrutement_description ||
		req.body.new_fichier_recrutement_description == ''
	) {
		res.redirect('/')
		return 0
	}

	const fichierTitle = req.body.new_fichier_recrutement_title
	const fichierDescritpion = req.body.new_fichier_recrutement_description

	const createdFichierRecrutement = await FichierRecrutement.create({
		title: fichierTitle,
		description: fichierDescritpion,
		dossierRecrutementId: dossierId,
	})

	res.redirect(`/dossierRecrutement/create/${foundDossierRecrutement[0].dataValues.candidatureId}`)
}
