const { AccountCreationDemand } = require('@models')
const auth = require('@utils/authentication')
const jwt = require('jsonwebtoken')
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

	const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
	const { rh: isRh, manager: isManager, finance: isFinance, it: isIt } = decodedToken

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

	res.render('accountCreationDemandList', {
		layout: 'mainWorkspaceSidebar',
		...params,
	})
}
