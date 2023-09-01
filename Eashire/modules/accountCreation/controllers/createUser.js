const {
	AccountCreationDemand,
	Candidature,
	DossierRecrutement,
	FichierRecrutement,
	FichePoste,
	Ressource,
	ShareList,
} = require('@models')
const auth = require('@utils/authentication')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const graph = require('../../../utils/azureService/graph')

const { ADMIN_FILES_BASE_PATH } = process.env

exports.process = async (req, res) => {
	const { accountCreationDemandId } = req.params
	if (!accountCreationDemandId || accountCreationDemandId == '') {
		res.redirect('/')
		return
	}

	const { dataValues: accountCreationDemand } = await AccountCreationDemand.findOne({
		where: { id: accountCreationDemandId },
	})
	const { dataValues: candidature } = await Candidature.findOne({
		where: { id: accountCreationDemand.candidatureId },
	})
	const passwordPolicies = 'DisablePasswordExpiration'
	const password = createPassword()
	const passwordProfile = {
		password: password,
		forceChangePasswordNextSignIn: true,
	}
	const usageLocation = 'FR'
	const preferredLanguage = 'fr-FR'

	let userPrincipalName = ''
	let domain = ''
	let surname = ''
	let givenName = ''
	let displayName = ''

	const department = ''
	const jobTitle = ''
	const officeLocation = ''
	const mailNickname = ''
	const mobilePhone = ''

	const { domains } = graph.getAzureConfig()

	if (
		!req.body.account_creation_userPrincipalName ||
		req.body.account_creation_userPrincipalName == '' ||
		req.body.account_creation_userPrincipalName.includes(' ') ||
		req.body.account_creation_userPrincipalName.includes('@') ||
		!req.body.account_creation_domain ||
		req.body.account_creation_domain == '' ||
		req.body.account_creation_domain == '-' ||
		!domains.includes(req.body.account_creation_domain) ||
		!req.body.account_creation_surname ||
		req.body.account_creation_surname == '' ||
		!req.body.account_creation_givenName ||
		req.body.account_creation_givenName == '' ||
		!req.body.account_creation_displayName ||
		req.body.account_creation_displayName == ''
	) {
		res.redirect('/')
		return
	}

	userPrincipalName = req.body.account_creation_userPrincipalName
	domain = req.body.account_creation_domain
	surname = req.body.account_creation_surname
	givenName = req.body.account_creation_givenName
	displayName = req.body.account_creation_displayName

	const userInfo = {
		passwordPolicies: passwordPolicies,
		passwordProfile: passwordProfile,
		usageLocation: usageLocation,
		preferredLanguage: preferredLanguage,
		accountEnabled: true,
		userPrincipalName: `${userPrincipalName}${domain}`,
		surname: surname,
		givenName: givenName,
		displayName: displayName,
	}

	if (req.body.account_creation_department && req.body.account_creation_department != '') {
		userInfo.department = req.body.account_creation_department
	}
	if (req.body.account_creation_jobTitle && req.body.account_creation_jobTitle != '') {
		userInfo.jobTitle = req.body.account_creation_jobTitle
	}
	if (req.body.account_creation_officeLocation && req.body.account_creation_officeLocation != '') {
		userInfo.officeLocation = req.body.account_creation_officeLocation
	}
	if (req.body.account_creation_mailNickname && req.body.account_creation_mailNickname != '') {
		userInfo.mailNickname = req.body.account_creation_mailNickname
	}
	if (req.body.account_creation_mobilePhone && req.body.account_creation_mobilePhone != '') {
		userInfo.mobilePhone = req.body.account_creation_mobilePhone
	}

	const { userId } = auth.getTokenInfo(req)
	const data = await graph.createUser(req.app.locals.msalClient, userId, userInfo)
	if (data) {
		const userDetails = await graph.getUserDetails(
			req.app.locals.msalClient,
			userId,
			data.userPrincipalName,
		)

		console.log('}}}}}}}}}}}}}}}}}}}}}}}}}')
		console.log('}}}}}}}}}}}}}}}}}}}}}}}}}')
		console.log('}}}}}}}}}}}}}}}}}}}}}}}}}')
		console.log('USER DETAILS')
		console.log(userDetails)

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'achoui.hillal@gmail.com',
				pass: 'wofgpkqnlrmtsfrs',
			},
		})
		const mailtext =
			`Bonjour ${userDetails.displayName},\n\n` +
			`Nous avons le plaisir de vous transmettre vos ` +
			`identifiants professionnels. Ils vous permettront ` +
			`notamment d'accéder à notre solution employé sur le site eashire.com\n \n` +
			`Vos identifiants sont les suivants : \n` +
			`  - Email : ${userDetails.userPrincipalName}\n` +
			`  - Mot de passe : ${password}\n` +
			`Gardez ces informations secrètes. Nous ne vous demanderons jamais` +
			`vos identifiants ou mot de passe.\n\n Nous vous souhaitons une excellente journée,\nCordialement`

		const mailOptions = {
			from: 'achoui.hillal@gmail.com',
			to: `${candidature.mail}`,
			subject: 'Compte professionnel',
			text: mailtext,
		}
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error)
				res.status(500).send({ msg: 'Failed to send email' })
			} else {
				console.log(`Email sent: ${info.response}`)
			}
		})

		console.log('################################')
		console.log('################################')
		console.log('################################')
		console.log('CANDIDATURE')
		console.log(candidature)

		const { dataValues: dossierRecrutement } = await DossierRecrutement.findOne({
			where: { candidatureId: candidature.id },
		})

		console.log('################################')
		console.log('################################')
		console.log('################################')
		console.log('DOSSIER RECRUTEMENT')
		console.log(dossierRecrutement)

		const fichiersRecrutementData = await FichierRecrutement.findAll({
			where: { dossierRecrutementId: dossierRecrutement.id },
		})

		const fichiersRecrutement = fichiersRecrutementData.map((fichier) => fichier.dataValues)
		console.log('################################')
		console.log('################################')
		console.log('################################')
		console.log('FICHIER RECRUTEMENT')
		console.log(fichiersRecrutement)

		const { dataValues: fichePoste } = await FichePoste.findOne({
			where: { id: candidature.fichePosteId },
		})
		console.log('################################')
		console.log('################################')
		console.log('################################')
		console.log('FICHE POSTE')
		console.log(fichePoste)

		for (const fichier of fichiersRecrutement) {
			// CREATE RESSOURCE
			const { dataValues: ressource } = await Ressource.create({
				name: fichier.title,
				path: fichier.fileName,
				ownerUserId: trimString(userDetails.id),
				ownerUserDisplayName: userDetails.displayName,
				folderName: `${ADMIN_FILES_BASE_PATH}/${dossierRecrutement.directoryId}`,
				sharable: 0,
				adminFile: 1,
			})
			console.log('[[[[[[[[[[[[[[[[[[[[[[[[[[[[[(')
			console.log('[[[[[[[[[[[[[[[[[[[[[[[[[[[[[(')
			console.log('[[[[[[[[[[[[[[[[[[[[[[[[[[[[[(')
			console.log('CREATED RESSOURCE')
			console.log(ressource)
			// SHARE RESSOURCE WITH HR
			const { dataValues: shareList } = await ShareList.create({
				ressourceId: ressource.id,
				userId: trimString(fichePoste.rhId),
			})
			console.log('[[[[[[[[[[[[[[[[[[[[[[[[[[[[[(')
			console.log('[[[[[[[[[[[[[[[[[[[[[[[[[[[[[(')
			console.log('[[[[[[[[[[[[[[[[[[[[[[[[[[[[[(')
			console.log('CREATED SHARE LIST')
			console.log(shareList)
		}

		const params = { active: { accountCreatedRead: true }, user: data, userDetails: userDetails }

		const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
		const {
			userId: userId_,
			rh: isRh,
			manager: isManager,
			finance: isFinance,
			it: isIt,
		} = decodedToken
		params.userId = userId_

		if (isRh == true) {
			params.rh = true
		}
		if (isManager == true) {
			params.manager = true
		}
		if (isFinance == true) {
			params.finance = true
		}
		if (isIt == true) {
			params.it = true
		}
		res.render('accountCreatedRead', {
			layout: 'mainWorkspaceSidebar',
			...params,
		})
	} else {
		res.redirect('/')
	}
}

function createPassword() {
	const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
	const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const numberChars = '0123456789'
	const specialChars = '!@#$%^&*()_+~`|}{[]:;?><,./-='
	let password = ''

	// Generate one lowercase character
	const lowercaseChar = lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length))
	password += lowercaseChar

	// Generate one uppercase character
	const uppercaseChar = uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length))
	password += uppercaseChar

	// Generate one number
	const numberChar = numberChars.charAt(Math.floor(Math.random() * numberChars.length))
	password += numberChar

	// Generate one special character
	const specialChar = specialChars.charAt(Math.floor(Math.random() * specialChars.length))
	password += specialChar

	// Generate the remaining characters
	for (let i = 0; i < 6; i++) {
		const allChars = lowercaseChars + uppercaseChars + numberChars + specialChars
		const randomChar = allChars.charAt(Math.floor(Math.random() * allChars.length))
		password += randomChar
	}
	console.log('RANDOM PASSWORD : ', password)
	return password
}

function trimString(inputString) {
	if (inputString.includes('@')) {
		return inputString.split('@')[0]
	}
	if (inputString.includes('.')) {
		return inputString.split('.')[0]
	}
	return inputString // return the original string if no '@' or '.' is found
}
