const _module = require('@ressources')
const auth = require('@utils/authentication')
const router = require('express-promise-router')()
const jwt = require('jsonwebtoken')
const multer = require('multer')

const uploadFile = _module.controller

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if (file.mimetype == 'application/pdf' || file.mimetype == 'image/jpeg') {
			cb(null, './public/servedFiles/adminFile')
		} else {
			return cb(new Error('Only .pdf or .jpeg allowed'))
		}
	},
	filename: function (req, file, cb) {
		cb(null, `${req.body.titre}.${file.mimetype.split('/').reverse()[0]}`)
	},
})
const upload = multer({ storage: storage })

router.post('/create', auth.authenticated, upload.single('document'), uploadFile.create)
router.get('/', auth.authenticated, function (req, res, next) {
	const params = {}

	const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
	const { userId, rh: isRh, manager: isManager, finance: isFinance, it: isIt } = decodedToken

	if (isRh == true) {
		params.rh = true
	}
	if (isManager == true) {
		params.manager = true
	}
	if (isFinance == true) {
		params.finance = true
	}
	if (isIt == true) {
		params.it = true
	}

	res.render('uploadFileRh', {
		layout: 'mainWorkspaceSidebar',
		...params,
	})
})
module.exports = router
