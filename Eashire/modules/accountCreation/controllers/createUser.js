const { AccountCreationDemand } = require('@models')
const auth = require('@utils/authentication')
const azureService = require('@utils/azureService/graph')

const graph = require('../../../utils/azureService/graph')

exports.process = async (req, res) => {
	const { accountCreationDemandId } = req.params
	if (!accountCreationDemandId || accountCreationDemandId == '') {
		res.redirect('/')
		return
	}
	const passwordPolicies = 'DisablePasswordExpiration'
	const passwordProfile = {
		password: createPassword(),
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
		console.log(data)
		const userDetails = await graph.getUserDetails(
			req.app.locals.msalClient,
			userId,
			data.userPrincipalName,
		)
		const params = { active: { accountCreatedRead: true }, user: data, userDetails: userDetails }
		res.render('accountCreatedRead', params)
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
