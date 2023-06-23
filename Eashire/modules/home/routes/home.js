const _module = require('@home')
const express = require('express')

const router = express.Router()
const homeController = _module.controller

/* GET home page. */
router.get('/', function (req, res, next) {
	const params = {
		active: { home: true },
		userId: req.session.userId,
	}
	if (req.session.userId) {
		params.userId = req.session.userId
	}

	res.render('home', params)
})
router.get('/joblist', homeController.getPublish)

module.exports = router
