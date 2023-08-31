const { User, Ressource, ShareList } = require('@models')
const graph = require('@utils/azureService/graph.js')
const jwt = require('jsonwebtoken')

const { RESSOURCE_BASE_PATH } = process.env

exports.process = async (req, res) => {
	const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
	const { userId, rh: isRh, manager: isManager, finance: isFinance, it: isIt } = decodedToken
	const params = {
		ressourceCreateLink: `/ressources/create`,
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

	const { ressourceId } = req.params
	const { dataValues: ressource } = await Ressource.findOne({ where: { id: ressourceId } })
	const shareListData = await ShareList.findAll({ where: { ressourceId: ressourceId } })

	if (shareListData && shareListData.length > 0) {
		const shareList = shareListData.map((currShareList) => currShareList.dataValues)

		const userDetails = await graph.getUserDetails(req.app.locals.msalClient, shareList.userId)
		ressource
	}

	console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
	console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
	console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
	console.log('RESSOURCE')
	console.log(ressource)

	params.ressource = ressource

	res.render('ressourcesRecentPage', {
		layout: 'mainRessourcesWithSidebar',
		...params,
	})
}
