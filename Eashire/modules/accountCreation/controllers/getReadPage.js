const { AccountCreationDemand, Message, User } = require('@models')
const auth = require('@utils/authentication')
const azureService = require('@utils/azureService/graph')
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')

const { Op } = Sequelize

exports.process = async (req, res) => {
	const { accountCreationDemandId } = req.params
	if (!accountCreationDemandId || accountCreationDemandId == '') {
		res.redirect('/')
		return
	}

	let foundAccountCreationDemand = await AccountCreationDemand.findAll({
		where: { id: accountCreationDemandId },
	})
	if (
		!foundAccountCreationDemand ||
		!foundAccountCreationDemand.length > 0 ||
		!foundAccountCreationDemand[0].dataValues
	) {
		res.redirect('/')
		return
	}

	const params = { active: { accountCreationDemandRead: true } }
	foundAccountCreationDemand = foundAccountCreationDemand[0].dataValues
	foundAccountCreationDemand.displayName = `${foundAccountCreationDemand.prenom} ${foundAccountCreationDemand.nom}`
	foundAccountCreationDemand.mailNickname = `${
		foundAccountCreationDemand.prenom
	}${foundAccountCreationDemand.nom.charAt(0).toUpperCase()}`

	foundAccountCreationDemand.userPrincipalName = await createUserPrincipalName(
		req,
		foundAccountCreationDemand.prenom,
		foundAccountCreationDemand.nom,
	)

	params.accountCreationDemand = foundAccountCreationDemand
	params.domains = azureService.getAzureConfig().domains

	const {
		userId,
		manager: isManager,
		rh: isRh,
		it: isIt,
		finance: isFinance,
	} = auth.getTokenInfo(req)
	if (isManager == true) {
		params.isManager = isManager
	} else if (isRh == true) {
		params.isRh = isRh
	} else if (isIt == true) {
		params.isIt = isIt
		params.validateAccountDemandLink = `/accountcreationdemand/validate/${foundAccountCreationDemand.id}`
		params.refuseAccountDemandLink = `/accountcreationdemand/refuse/${foundAccountCreationDemand.id}`
		await AccountCreationDemand.update(
			{
				itId: userId,
			},
			{
				where: { id: foundAccountCreationDemand.id },
			},
		)
	}
	const userInfos = await User.findAll({ where: { userId: userId } })

	if (req.body.accountcreationdemand_message && req.body.accountcreationdemand_message != '') {
		let currentConversationId
		let message
		if (
			foundAccountCreationDemand.conversationId &&
			foundAccountCreationDemand.conversationId != ''
		) {
			currentConversationId = foundAccountCreationDemand.conversationId
			const messageOrder = await findMessageUnusedOrder(currentConversationId)
			message = {
				conversationId: currentConversationId,
				text: req.body.accountcreationdemand_message,
				messageOrderId: messageOrder,
				ownerUserId: userId,
				ownerDisplayName: userInfos[0].dataValues.displayName,
			}
		} else {
			currentConversationId = await findFirstUnusedConversationId()
			message = {
				conversationId: currentConversationId,
				text: req.body.accountcreationdemand_message,
				messageOrderId: 0,
				ownerUserId: userId,
				ownerDisplayName: userInfos[0].dataValues.displayName,
			}
		}
		await Message.create(message)
		params.displayMessage = true
	}

	params.createLink = `/accountcreationdemand/user/create/${foundAccountCreationDemand.id}`
	params.currentUserId = userId
	params.messageLink = `/accountcreationdemand/read/${foundAccountCreationDemand.id}`
	console.log(params.currentUserId)
	if (foundAccountCreationDemand.conversationId) {
		const conversation = await Message.findAll({
			where: { conversationId: foundAccountCreationDemand.conversationId },
		})
		console.log(conversation.map((message) => message.dataValues))

		params.conversation = conversation.map(({ dataValues: message }) => {
			const offset_1 = message.createdAt.getTimezoneOffset()
			message.createdAt = new Date(message.createdAt.getTime() - offset_1 * 60 * 1000)
			message.createdAt = message.createdAt.toISOString().split('T')[0]
			if (userId == message.ownerUserId) {
				message.currentOwner = true
			} else if (message.isNew == 1) {
				params.newMessage = true
			}
			return message
		})
		if (params.newMessage == true) {
			await updateConversationNotification(foundAccountCreationDemand.conversationId, userId)
		}

		params.conversation = params.conversation.sort((a, b) => {
			if (a.messageOrderId < b.messageOrderId) {
				return true
			}
			return false
		})
	}

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

	res.render('accountCreationDemandRead', {
		layout: 'mainWorkspaceSidebar',
		...params,
	})
}

const updateConversationNotification = async (conversationId, userId) => {
	await Message.update(
		{ isNew: 0 },
		{
			where: {
				[Op.and]: [{ conversationId: conversationId }, { ownerUserId: { [Op.ne]: userId } }],
			},
		},
	)
}

const findFirstUnusedConversationId = async () => {
	const usedConversationIds = await Message.count({
		distinct: true,
		col: 'conversationId',
	})
	return usedConversationIds + 1
}

const findMessageUnusedOrder = async (conversationId) => {
	const usedMessageOrderIds = await Message.count({
		distinct: true,
		col: 'messageOrderId',
		where: {
			conversationId: conversationId,
		},
	})
	return usedMessageOrderIds + 1
}

async function createUserPrincipalName(req, prenom, nom) {
	let result = ''
	const { value: users } = await azureService.getUsers(
		req.app.locals.msalClient,
		req.session.userId,
	)
	const array = []
	users.forEach((user) => {
		array.push(user.userPrincipalName)
	})
	const number = extractMaxNumber(array, prenom, nom[0])
	result = `${prenom.toLowerCase()}${number == 0 ? '' : number + 1}${nom[0].toUpperCase()}`
	result = replaceSpecialCharacters(result)
	return result
}

function extractMaxNumber(strings, firstname, lastnameLetter) {
	let maxNumber = 0
	const firstname_c = firstname.toLowerCase()
	const lastnameLetter_c = lastnameLetter.toLowerCase()
	for (let i = 0; i < strings.length; i++) {
		const string = strings[i].toLowerCase()
		if (string.includes(firstname_c) && string.includes(lastnameLetter_c)) {
			const startIndex = string.indexOf(firstname_c) + firstname_c.length
			const endIndex = string.indexOf(lastnameLetter_c)
			const numberString = string.slice(startIndex, endIndex)
			const number = parseInt(numberString)
			if (!isNaN(number) && number > maxNumber) {
				maxNumber = number
			}
		}
	}
	return maxNumber
}

function replaceSpecialCharacters(str) {
	return str.replace(/[^0-9a-zA-Z]/g, '_')
}
