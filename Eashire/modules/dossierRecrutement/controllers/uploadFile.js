const { Candidature, DossierRecrutement, FichierRecrutement, FichePoste } = require('@models')
const jwt = require('jsonwebtoken')

exports.process = async (req, res) => {
	try {
		// eslint-disable-next-line prefer-destructuring
		const token = req.query.token

		console.log(token)
		const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')

		const { fichePosteId } = decodedToken
		const { dossierRecrutementId } = decodedToken

		// Vérifier si le dossier de recrutement associé à l'ID existe et est valide
		const dossierRecrutement = await DossierRecrutement.findOne({
			where: { id: dossierRecrutementId },
		})

		if (!dossierRecrutement) {
			// Le dossier de recrutement n'existe pas ou n'est pas valide
			return res.status(404).json({ error: 'Dossier de recrutement introuvable' })
		}

		// Récupérer les fichiers de recrutement du dossier de recrutement
		const fichiersRecrutement = await FichierRecrutement.findAll({
			where: { dossierRecrutementId: dossierRecrutementId },
		})

		// Rendre la page d'upload en passant les fichiers de recrutement
		res.render('uploadDossierRecrutement', { fichiers: fichiersRecrutement, token: token })
	} catch (error) {
		// Gérer les erreurs
		console.error(error)
		res.status(500).json({ error: 'Une erreur est survenue' })
	}
}
