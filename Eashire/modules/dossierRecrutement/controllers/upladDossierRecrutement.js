const {
	DossierRecrutement,
	FichierRecrutement,
	Candidature,
	Ressource,
	ShareList,
} = require('@models')
const graph = require('@utils/azureService/graph.js')
const jwt = require('jsonwebtoken')

const fs = require('fs')
const path = require('path')

const fichierRecrutement = require('../../../database/models/fichierRecrutement')

exports.process = async (req, res) => {
	const { token } = req.body
	const { fichePosteId, dossierRecrutementId, candidatureId } = jwt.verify(
		token,
		'RANDOM_TOKEN_SECRET',
	)

	try {
		const { dataValues: dossierRecrutement } = await DossierRecrutement.findOne({
			where: { id: dossierRecrutementId },
		})

		if (dossierRecrutement.directoryId != null) {
			const directoryPath = path.join(
				__dirname,
				'/servedFiles/dossiersRecrutement/',
				dossierRecrutement.directoryId,
			)

			fs.rm(directoryPath, { recursive: true, force: true }, (err) => {
				if (err) {
					console.error(`Error while deleting directory ${directoryPath}: `, err)
				} else {
					console.log(`${directoryPath} is deleted!`)
				}
			})
		}

		await DossierRecrutement.update(
			{
				directoryId: req.directoryId,
				open: 0,
			},
			{
				where: {
					id: dossierRecrutementId,
				},
			},
		)

		for (const file of req.filesNames) {
			const [directoryName_, fileId_, fileName_] = file.split('-')
			await FichierRecrutement.update(
				{
					fileName: file,
				},
				{
					where: {
						id: fileId_,
					},
				},
			)
		}

		await Candidature.update(
			{
				dossierRecrutement: 0,
			},
			{ where: { id: candidatureId } },
		)
		const params = { active: { home: true }, dossierRecrutementSent: true }
		res.render('home', params)
	} catch (err) {
		// Handle error
		console.error(err)
		res.status(500).json({
			error:
				'An error occurred while updating the DossierRecrutement, FichierRecrutement or Candidature',
		})
	}
}
