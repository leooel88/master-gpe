const router = require('express-promise-router')();

const fichePoste = require('../controller/FichePoste.js');

router.get('/create', fichePoste.getCreatePage);

router.get('/create/test', fichePoste.createTestFicheposte);

router.post('/create', fichePoste.create);

router.post('/update/:fichePosteId', fichePoste.update);

router.delete('/delete:fichePosteId', fichePoste.delete);

router.get('/list', fichePoste.getListPage);

router.get('/read/:fichePosteId', fichePoste.getReadPage);

router.get('/rhvalid/:fichePosteId', fichePoste.rhValid);

router.get('/financevalid/:fichePosteId', fichePoste.financeValid);

router.get('/rhrefuse/:fichePosteId', fichePoste.rhRefuse);

router.get('/financerefuse/:fichePosteId', fichePoste.financeRefuse);

router.get;

module.exports = router;
