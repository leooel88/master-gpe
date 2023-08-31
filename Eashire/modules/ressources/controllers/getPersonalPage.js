const { Ressource } = require('@models')
const jwt = require('jsonwebtoken')

const { RESSOURCE_BASE_PATH } = process.env

exports.process = async (req, res) => {
	const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
	const { userId, rh: isRh, manager: isManager, finance: isFinance, it: isIt } = decodedToken
	const params = {
		ressourceCreateLink: `/ressources/create`,
	}

	console.log('###########################')
	console.log('###########################')
	console.log('###########################')
	console.log('USER ID')
	console.log(userId)

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

	const ressourcesData = await Ressource.findAll({ where: { ownerUserId: trimString(userId) } })
	console.log('========================================')
	console.log('========================================')
	console.log('========================================')
	console.log('RESSOURCES DATA')
	console.log(ressourcesData)
	let ressources = []

	if (ressourcesData && ressourcesData.length > 0) {
		ressourcesData.forEach((ressource) => {
			ressources.push(ressource.dataValues)
		})
	}

	console.log('========================================')
	console.log('========================================')
	console.log('========================================')
	console.log('RESSOURCES ARRAY')
	console.log(ressources)

	// Filter ADMIN FILES
	ressources = ressources.filter((ressource) => {
		if (ressource.adminFile && ressource.adminFile == 1) {
			return false
		}
		return true
	})

	// Prepare RESSOURCES
	ressources = ressources.map((ressource, i) => {
		// Set 'Moi' instead of Id
		if (ressource.ownerUserId == trimString(userId)) {
			ressource.ownerUserDisplayName = 'Moi'
		}

		// Add Even for display
		if (i % 2 == 0) {
			ressource.even = true
		}
		// Format Date
		ressource.updatedAt = formatDate(ressource.updatedAt)

		// Set File Link
		if (ressource.folderName && ressource.folderName != '') {
			ressource.fileLink = `${ressource.folderName}/${ressource.path}`
		} else {
			ressource.fileLink = `${RESSOURCE_BASE_PATH}/${ressource.path}`
		}

		// Add modification Link
		ressource.modifyLink = `/ressources/modify/${ressource.id}`

		return ressource
	})

	// Sort RESSOURCES by UPDATE DATE
	ressources = ressources.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

	console.log('========================================')
	console.log('========================================')
	console.log('========================================')
	console.log('RESSOURCES ARRAY')
	console.log(ressources)
	params.resourceArray = ressources

	res.render('ressourcesRecentPage', {
		layout: 'mainRessourcesWithSidebar',
		...params,
	})
}

function formatDate(dateObj) {
	const dd = String(dateObj.getDate()).padStart(2, '0')
	const mm = String(dateObj.getMonth() + 1).padStart(2, '0') // January is 0!
	const yyyy = dateObj.getFullYear()

	const hh = String(dateObj.getHours()).padStart(2, '0')
	const min = String(dateObj.getMinutes()).padStart(2, '0')

	return `${dd}/${mm}/${yyyy} ${hh}:${min}`
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
