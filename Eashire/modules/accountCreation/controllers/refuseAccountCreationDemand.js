const { AccountCreationDemand, Candidature, User } = require('@models')
const auth = require('@utils/authentication')
const azureService = require('@utils/azureService/graph')

exports.process = async (req, res) => {
	const { accountCreationDemandId } = req.params
	if (!accountCreationDemandId || accountCreationDemandId == '') {
		res.redirect('/')
		return
	}

	const foundAccountCreationDemand = await AccountCreationDemand.findAll({
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

	await AccountCreationDemand.update(
		{
			status: 2,
		},
		{
			where: { id: foundAccountCreationDemand[0].dataValues.id },
		},
	)

	await Candidature.update(
		{
			accountDemand: 2,
		},
		{
			where: { id: foundAccountCreationDemand[0].dataValues.candidatureId },
		},
	)

	res.redirect(`/accountCreationDemand/read/${foundAccountCreationDemand[0].dataValues.id}`)
}
