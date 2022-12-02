const auth = require('@utils/authentication')
const _module = require('@workspace')
const router = require('express-promise-router')()

const workspaceController = _module.controller

router.get('/manager', auth.authenticatedManager, workspaceController.getManagerWorkspace)
router.get('/finance', auth.authenticatedFinance, workspaceController.getFinanceWorkspace)
router.get('/rh', auth.authenticatedRh, workspaceController.getRhWorkspace)
router.get('/default', auth.authenticated, function (req, res, next) {
	const params = {
		active: { dashboardDefault: true },
	}

	res.render('dashboardDefault', params)
})

module.exports = router
