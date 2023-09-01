const { DossierRecrutement, FichierRecrutement, FichePoste, Candidature } = require('@models')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

exports.process = async (req, res) => {
	const { dossierRecrutementId } = req.body
	const { dataValues: dossierRecrutementData } = await DossierRecrutement.findOne({
		where: { id: dossierRecrutementId },
	})
	const { candidatureId } = dossierRecrutementData
	const data = await Candidature.findAll({
		where: { id: candidatureId },
	})

	const fichiersRecrutementData = await FichierRecrutement.findAll({
		where: { dossierRecrutementId: dossierRecrutementId },
	})

	const fichiersRecrutementFormattedData = fichiersRecrutementData.map((fichierRecrutement) => {
		return {
			title: fichierRecrutement.dataValues.title,
			description: fichierRecrutement.dataValues.description,
		}
	})

	const { fichePosteId } = data[0]
	const fichePoste = await FichePoste.findOne({
		where: { id: fichePosteId },
	})

	const jobLabel = fichePoste.label

	// Créer le token avec les ID spécifiés
	const token = jwt.sign(
		{
			fichePosteId: fichePosteId,
			dossierRecrutementId: dossierRecrutementId,
			candidatureId: candidatureId,
		},
		'RANDOM_TOKEN_SECRET',
	)

	await DossierRecrutement.update({ open: 1 }, { where: { id: dossierRecrutementId } })

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'achoui.hillal@gmail.com',
			pass: 'wofgpkqnlrmtsfrs',
		},
	})
	let mailtext =
		`Bonjour ${data[0].nom},\n\n` +
		`Suite à vos actions, nous avons bien reçu votre dossier de recrutement. Néanmoins celui ci a été refusé.\nLe représentant aillant refusé votre dossier a laissé le message suivant :\n\n${req.body.message}\n\n` +
		`Veuillez retourner à cette adresse, et remplir à nouveau votre dossier de recrutement AU COMPLET\nhttp://localhost:8080/dossierrecrutement/upload?token=${token}\n\n` +
		`Pour rappel, voici les fichiers à renseigner : `
	for (const fichier of fichiersRecrutementFormattedData) {
		mailtext += ` - ${fichier.title} : ${fichier.description} \n`
	}
	mailtext += 'Merci à vous et à bientôt,\nCordialement'

	const mailOptions = {
		from: 'achoui.hillal@gmail.com',
		to: data[0].mail,
		subject: "Offre d'emploi ",
		text: mailtext,
	}
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error)
			res.status(500).send({ msg: 'Failed to send email' })
		} else {
			console.log(`Email sent: ${info.response}`)
			res.render('dossierRecrutementCreatePage')
		}
	})

	await Candidature.update({ dossierRecrutement: -1 }, { where: { id: candidatureId } })
	res.redirect(`/candidature/read/${candidatureId}`)
}
