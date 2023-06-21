const _module = require('@dossierRecrutement')
const auth = require('@utils/authentication')
const router = require('express-promise-router')()

const dossierRecrutementController = _module.controller

router.get(
	'/create/:candidatureId',
	auth.authenticatedRh,
	dossierRecrutementController.getCreatePage,
)

router.post(
	'/addfile/:dossierRecrutementId',
	auth.authenticatedRh,
	dossierRecrutementController.addFile,
)

router.get(
	'/delete/:dossierRecrutementId/file/:fichierRecrutementId',
	auth.authenticatedRh,
	dossierRecrutementController.deleteFile,
)

module.exports = router