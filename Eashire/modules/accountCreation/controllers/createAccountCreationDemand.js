const { Candidature, User, AccountCreationDemand, Message } = require('@models')
const auth = require('@utils/authentication')
const Sequelize = require('sequelize')

exports.process = async (req, res) => {
	const { candidatureId } = req.params

	if (!candidatureId || candidatureId == '') {
		res.redirect('/')
		return
	}

	const foundCandidature = await Candidature.findAll({ where: { id: candidatureId } })

	if (!foundCandidature || !foundCandidature.length > 0 || !foundCandidature[0].dataValues) {
		res.redirect('/')
		return
	}

	if (foundCandidature[0].dataValues.accountDemand != null) {
		res.redirect('/')
		return 0
	}

	let firstname = ''
	let lastname = ''
	let phone = ''
	let jobLabel = ''
	let jobService = ''
	let jobLocation = ''

	if (!req.body.account_demand_firstname || !req.body.account_demand_firstname != '') {
		res.redirect('/')
		return
	}
	firstname = req.body.account_demand_firstname

	if (!req.body.account_demand_lastname || !req.body.account_demand_lastname != '') {
		res.redirect('/')
		return
	}
	lastname = req.body.account_demand_lastname

	if (!req.body.account_demand_telephone || !req.body.account_demand_telephone != '') {
		res.redirect('/')
		return
	}
	phone = req.body.account_demand_telephone

	if (!req.body.account_demand_job_label || !req.body.account_demand_job_label != '') {
		res.redirect('/')
		return
	}
	jobLabel = req.body.account_demand_job_label

	if (!req.body.account_demand_service || !req.body.account_demand_service != '') {
		res.redirect('/')
		return
	}
	jobService = req.body.account_demand_service

	if (!req.body.account_demand_address || !req.body.account_demand_address != '') {
		res.redirect('/')
		return
	}
	jobLocation = req.body.account_demand_address

	const { userId } = auth.getTokenInfo(req)
	const userInfos = await User.findAll({ where: { userId: userId } })

	if (!userInfos || !userInfos.length > 0 || !userInfos[0].dataValues) {
		res.redirect('/')
		return
	}

	const saveObject = {
		prenom: firstname,
		nom: lastname,
		telephone: phone,
		label: jobLabel,
		destinationService: jobService,
		jobLocation: jobLocation,
		candidatureId: candidatureId,
		fichePosteId: foundCandidature[0].dataValues.fichePosteId,
		demandingRhId: userId,
		rhDisplayName: userInfos[0].dataValues.displayName,
	}

	if (
		req.body.account_demand_rh_note ||
		req.body.account_demand_rh_note != '' ||
		req.body.account_demand_rh_note.length > 500
	) {
		const conversationId = await findFirstUnusedConversationId()
		console.log(conversationId)
		const message = {
			conversationId: conversationId,
			text: req.body.account_demand_rh_note,
			messageOrderId: 0,
			ownerUserId: userId,
			ownerDisplayName: userInfos[0].dataValues.displayName,
		}
		console.log(message)
		await Message.create(message)
		saveObject.conversationId = conversationId
	}

	await AccountCreationDemand.create(saveObject)
	await Candidature.update(
		{ accountDemand: 0 },
		{
			where: {
				id: candidatureId,
			},
		},
	)

	res.redirect(`/candidature/read/${candidatureId}`)
}

const findFirstUnusedConversationId = async () => {
	const usedConversationIds = await Message.count({
		distinct: true,
		col: 'conversationId',
	})
	return usedConversationIds + 1
}
