const { ShareList, Ressource } = require('@models')
const graph = require('@utils/azureService/graph.js')
const jwt = require('jsonwebtoken')
const multer = require('multer')

const crypto = require('crypto') // Node.js native module for creating random IDs
const path = require('path') // Node.js native module for handling paths

exports.process = async (req, res) => {
	const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
	const { userId, rh: isRh, manager: isManager, finance: isFinance, it: isIt } = decodedToken
	const params = {}

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

	console.log('##############################')
	console.log('##############################')
	console.log('##############################')
	console.log('BODY')
	console.log(req.body)

	try {
		validateRessourceInputs(req)
		let usersArray = []

		if (req.body['selectedUsers']) {
			if (typeof req.body['selectedUsers'] === 'string') {
				usersArray.push(req.body['selectedUsers'])
			} else if (Array.isArray(req.body['selectedUsers'])) {
				usersArray = [...req.body['selectedUsers']]
			}
		}

		if (req.body['selectedGroups']) {
			if (typeof req.body['selectedGroups'] === 'string') {
				console.log('HAHAHAHAHHAHAHAHAHAHAHAHAHAHHA')
				console.log('HAHAHAHAHHAHAHAHAHAHAHAHAHAHHA')
				console.log('HAHAHAHAHHAHAHAHAHAHAHAHAHAHHA')
				try {
					const { value: groupMembers } = await graph.getGroupMembers(
						req.app.locals.msalClient,
						userId,
						req.body['selectedGroups'],
					)
					for (const user of groupMembers) {
						usersArray.push(user.id)
					}

					console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
					console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
					console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
					console.log('GROUP MEMBERS')
					console.log(groupMembers)
				} catch (err) {
					console.log('NO MEMBERS IN GROUP : ', req.body['selectedGroups'])
				}
			} else if (Array.isArray(req.body['selectedGroups'])) {
				console.log('OOOOOOOOOOOOOOOOOOOOOOOOOOOO')
				console.log('OOOOOOOOOOOOOOOOOOOOOOOOOOOO')
				console.log('OOOOOOOOOOOOOOOOOOOOOOOOOOOO')
				for (const group of req.body['selectedGroups']) {
					try {
						const { value: groupMembers } = await graph.getGroupMembers(
							req.app.locals.msalClient,
							userId,
							group,
						)
						console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
						console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
						console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
						console.log('GROUP MEMBERS')
						console.log(groupMembers)
						for (const user of groupMembers) {
							usersArray.push(user.id)
						}
					} catch (err) {
						console.log('NO MEMBERS IN GROUP : ', group)
					}
				}
			}
		}

		console.log('(((((((((((((((((((((((((((((((((((((')
		console.log('(((((((((((((((((((((((((((((((((((((')
		console.log('(((((((((((((((((((((((((((((((((((((')
		console.log('SHARE LIST')
		console.log(usersArray)

		const userDetails = await graph.getUserDetails(req.app.locals.msalClient, userId)
		console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
		console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
		console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
		console.log('USER DETAILS')
		console.log(userDetails)

		const ressourceSaved = {
			name: req.body['ressource-name'],
			path: req.filePath,
			ownerUserId: trimString(userId),
			ownerUserDisplayName: userDetails.displayName,
			shareListId: '',
		}

		console.log('~~~~~~~~~~~~~~~~~~~~~~')
		console.log('~~~~~~~~~~~~~~~~~~~~~~')
		console.log('~~~~~~~~~~~~~~~~~~~~~~')
		console.log('RESSOURCE OBJECT')
		console.log(ressourceSaved)

		const { dataValues: createdRessource } = await Ressource.create(ressourceSaved)
		console.log('------------------------------')
		console.log('------------------------------')
		console.log('------------------------------')
		console.log('CREATED RESSOURCE')
		console.log(createdRessource)

		for (const user of usersArray) {
			await ShareList.create({
				ressourceId: createdRessource.id,
				userId: user,
			})
		}
	} catch (err) {
		console.log(err)
		res.redirect('/')
		return
	}

	res.redirect('/ressources')
}

function validateRessourceInputs(req) {
	// Check if the user has entered a name
	if (!req.body['ressource-name']) {
		throw 'ERROR : No ressource name passed.'
	}

	// Check if the user has uploaded a file
	if (!req.file) {
		throw 'ERROR : No ressource file passed.'
	}
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
