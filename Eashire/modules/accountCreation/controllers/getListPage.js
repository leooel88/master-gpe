const { AccountCreationDemand } = require('@models')
const auth = require('@utils/authentication')
const Sequelize = require('sequelize')

const { Op } = Sequelize

exports.process = async (req, res) => {
	const { userId } = auth.getTokenInfo(req)
	const foundAccountCreationDemands = await AccountCreationDemand.findAll({
		where: {
			[Op.or]: [{ itId: null }, { itId: userId }],
		},
	})

	if (!foundAccountCreationDemands) {
		res.redirect('/')
		return
	}

	const params = {
		active: { accountCreationDemandList: true },
	}

	if (foundAccountCreationDemands.length == 0) {
		params.emptyList = true
	} else {
		let resultList = foundAccountCreationDemands.map(
			(foundAccountCreationDemand) => foundAccountCreationDemand.dataValues,
		)
		resultList = resultList.map((item) => {
			const offset_1 = item.createdAt.getTimezoneOffset()
			return {
				...item,
				readLink: `/accountcreationdemand/read/${item.id}`,
				createdAt: new Date(item.createdAt.getTime() - offset_1 * 60 * 1000)
					.toISOString()
					.split('T')[0],
			}
		})
		params.accountCreationDemandList = resultList
	}

	res.render('accountCreationDemandList', params)
}
