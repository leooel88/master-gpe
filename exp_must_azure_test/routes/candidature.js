const router = require('express-promise-router')();

const Candidature = require('../controller/Candidature.js');

router.get('/create/:fichePosteId', Candidature.getReadPage);

// router.get('/create/test:fichePosteId', Candidature.createTestCandidature);

router.post('/create', Candidature.create);

module.exports = router;