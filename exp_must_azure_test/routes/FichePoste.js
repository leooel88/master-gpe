const router = require('express-promise-router')();

const fichePoste = require('../controller/FichePoste.js');

router.get('/create', fichePoste.getCreatePage);

router.get('/create/test', fichePoste.createTestFicheposte);

router.post('/create', fichePoste.create);

router.get('/update', fichePoste.getUpdatePage);

router.post('/update', fichePoste.update);

router.delete('/delete:fichePosteId', fichePoste.delete);

router.get('/list', fichePoste.getListPage);

router.get('/read/:fichePosteId', fichePoste.getReadPage);

router.get;

module.exports = router;
