const _module = require('@ressources')
const auth = require('@utils/authentication')
const router = require('express-promise-router')()

const ressourcesController = _module.controller

router.get('/', auth.authenticated, ressourcesController.getRecentPage)

router.get('/personal', auth.authenticated, ressourcesController.getPersonalPage)

router.get('/shared', auth.authenticated, ressourcesController.getSharedPage)

router.get('/create', auth.authenticated, ressourcesController.getCreateRessourcePage)

router.post(
	'/create',
	auth.authenticated,
	ressourcesController.saveFile,
	ressourcesController.createRessource,
)

module.exports = router
