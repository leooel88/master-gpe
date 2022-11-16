const _module = require('@workspace')
const router = require('express-promise-router')()

const workspaceController = _module.controller

router.get('/manager', workspaceController.getManagerWorkspace)
router.get('/finance', workspaceController.getFinanceWorkspace)
router.get('/rh', workspaceController.getRhWorkspace)
router.get('/default', function (req, res, next) {
	const params = {
		active: { dashboardDefault: true },
	}

	res.render('dashboardDefault', params)
})

module.exports = router
