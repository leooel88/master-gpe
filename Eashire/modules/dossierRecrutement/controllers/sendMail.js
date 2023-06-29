const { Candidature, DossierRecrutement, FichierRecrutement } = require('@models')
const mysql = require('mysql2')
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

	// const { dataValues: fichiersRecrutementData } = await FichierRecrutement.findAll({
	// 	where: { dossierRecrutementId: dossierRecrutementId },
	// })

	console.log(dossierRecrutementData)
	console.log('====================')
	console.log(data[0].mail)
	console.log('====================')

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'achoui.hillal@gmail.com',
			pass: 'wofgpkqnlrmtsfrs',
		},
	})
	const mailOptions = {
		from: 'achoui.hillal@gmail.com',
		to: data[0].mail,
		subject: "Offre d'emploi ",
		text:
			'Bonjour,\n\n' +
			"Je suis ravi de vous accueillir en tant que nouveau candidat.\n Nous sommes impatients de découvrir vos talents et compétences, et de voir comment vous pouvez contribuer à notre équipe et à notre organisation.\n Nous espérons que votre expérience ici sera enrichissante et passionnante, et que vous trouverez un environnement de travail stimulant et collaboratif. N'hésitez pas à poser des questions et à faire part de vos idées et suggestions. \n Nous sommes là pour vous aider à réussir et à atteindre vos objectifs professionnels.\n\n Bonne chance et bienvenue à bord !",
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
}
