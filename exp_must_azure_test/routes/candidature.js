const router = require('express-promise-router')();

const Candidature = require('../controller/Candidature.js');

const multer = require('multer');

const upload = multer();

router.get('/create/:fichePosteId', Candidature.getReadPage);

// router.get('/create/test:fichePosteId', Candidature.createTestCandidature);

router.post('/create', upload.single('candidature_CV'), Candidature.create);

module.exports = router;