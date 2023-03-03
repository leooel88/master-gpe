const _module = require('@accountCreation')
const auth = require('@utils/authentication')
const axios = require('axios')
const router = require('express-promise-router')()
const multer = require('multer')

const accountCreation = _module.controller

router.get('/create/:candidatureId', auth.authenticatedRh, accountCreation.getCreatePage)

router.get('/list', auth.authenticatedIt, accountCreation.getListPage)

router.get(
	'/read/:accountCreationDemandId',
	auth.authenticatedGroups(['RH', 'IT', 'MANAGER']),
	accountCreation.getReadPage,
)

router.post(
	'/read/:accountCreationDemandId',
	auth.authenticatedGroups(['RH', 'IT', 'MANAGER']),
	accountCreation.getReadPage,
)

router.post(
	'/create/:candidatureId',
	auth.authenticatedRh,
	accountCreation.createAccountCreationDemand,
)

router.post(
	'/user/create/:accountCreationDemandId',
	auth.authenticatedGroups(['IT']),
	accountCreation.createUser,
)

router.get(
	'/validate/:accountCreationDemandId',
	auth.authenticatedGroups(['IT']),
	accountCreation.validateAccountCreationDemand,
)

router.get(
	'/refuse/:accountCreationDemandId',
	auth.authenticatedGroups(['IT']),
	accountCreation.refuseAccountCreationDemand,
)

router.get('/addresses', async function (req, res) {
	const data = await axios.get(
		`https://api-adresse.data.gouv.fr/search/?q=${req.query.text}}&limit=15`,
	)
	res.json(data.data.features)
})
module.exports = router
