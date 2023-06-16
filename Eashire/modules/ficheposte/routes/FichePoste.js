const _module = require('@ficheposte')
const auth = require('@utils/authentication')
const router = require('express-promise-router')()

const fichePoste = _module.controller

router.get('/create', auth.authenticatedManager, fichePoste.getCreatePage)

router.get('/create/test', auth.authenticatedManager, fichePoste.createTestFicheposte)

router.post('/create', auth.authenticatedManager, fichePoste.create)

router.post('/update/:fichePosteId', auth.authenticatedManager, fichePoste.update)

router.get('/delete/:fichePosteId', auth.authenticatedManager, fichePoste.delete)

router.get('/archive/:fichePosteId', auth.authenticatedManager, fichePoste.archive)

router.get(
	'/list',
	auth.authenticatedGroups(['RH', 'FINANCE', 'MANAGER']),
	fichePoste.getKanbanPage,
)

router.post('/list', fichePoste.filterFichePosteList)

router.get('/kanban', fichePoste.getKanbanPage)

router.get('/read/:fichePosteId', fichePoste.getReadPage)

router.get('/rhvalid/:fichePosteId', auth.authenticatedRh, fichePoste.rhValid)

router.get('/rhrefuse/:fichePosteId', auth.authenticatedRh, fichePoste.rhRefuse)

router.get('/rhpublish/:fichePosteId', auth.authenticatedRh, fichePoste.rhPublish)

router.get('/financevalid/:fichePosteId', auth.authenticatedFinance, fichePoste.financeValid)

router.get('/financerefuse/:fichePosteId', auth.authenticatedFinance, fichePoste.financeRefuse)

module.exports = router
