const _module = require('@candidature')
const auth = require('@utils/authentication')
const router = require('express-promise-router')()
const multer = require('multer')

const Candidature = _module.controller

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if (file.mimetype == 'application/pdf') {
			cb(null, './public/servedFiles/CV')
		} else {
			return cb(new Error('Only .pdf allowed'))
		}
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	},
})
const upload = multer({ storage: storage })

router.get('/read/:candidatureId', auth.authenticatedManagerRhIt, Candidature.getReadPage)

router.get('/list', auth.authenticatedManagerRhIt, Candidature.getListPage)

router.post('/list', auth.authenticatedManagerRhIt, Candidature.filterCandidatureList)

router.get('/create/:fichePosteId', Candidature.getCreatePage)

router.post('/create', upload.single('candidature_CV'), Candidature.create)

router.get('/rhvalid/:candidatureId', auth.authenticatedRh, Candidature.rhValid)

router.get('/rhrefuse/:candidatureId', auth.authenticatedRh, Candidature.rhRefuse)

router.get('/managervalid/:candidatureId', auth.authenticatedManager, Candidature.managerValid)

router.get('/managerrefuse/:candidatureId', auth.authenticatedManager, Candidature.managerRefuse)

router.post('/savenote/:candidatureId', auth.authenticatedManagerRh, Candidature.saveNote)

module.exports = router
