const { Candidature, DossierRecrutement, FichierRecrutement, FichePoste } = require('@models')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const fs = require('fs')

exports.process = async (req, res) => {
	// eslint-disable-next-line spaced-comment
	//const { candidatureId } = req.params
	const { dossierRecrutementId } = req.params
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

	console.log(token)

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'achoui.hillal@gmail.com',
			pass: 'wofgpkqnlrmtsfrs',
		},
	})
	let mailtext =
		`Bonjour Mr ${data[0].nom} ,\n\n` +
		`J'ai le plaisir de vous annoncer que votre candidature au poste de ${jobLabel} à été retenue .\n Afin de mener à bien votre intégration administrative, nous avons besoin de certains documents que vous devrez nous envoyer \n en suivant le lien suivant \n \n https://eashire.com/dossierrecrutement/upload?token=${token} \n \n`
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
