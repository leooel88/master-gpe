const router = require('express-promise-router')();

const Candidature = require('../controllers/Candidature.js');

const multer = require('multer');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if (file.mimetype == 'application/pdf') {
			cb(null, './public/servedFiles/CV');
		} else {
			return cb(new Error('Only .pdf allowed'));
		}
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});
const upload = multer({ storage: storage });

router.get('/read/:candidatureId', Candidature.getReadPage);

router.get('/list', Candidature.getListPage);

// router.get('/create/test:fichePosteId', Candidature.createTestCandidature);

router.get('/create/:fichePosteId', Candidature.getCreatePage);

router.post('/create', upload.single('candidature_CV'), Candidature.create);

router.get('/rhvalid/:candidatureId', Candidature.rhValid);

router.get('/rhrefuse/:candidatureId', Candidature.rhRefuse);

router.get('/managervalid/:candidatureId', Candidature.managerValid);

router.get('/managerrefuse/:candidatureId', Candidature.managerRefuse);

router.post('/savenote/:candidatureId', Candidature.saveNote);

module.exports = router;
