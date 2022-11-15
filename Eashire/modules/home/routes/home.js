const express = require('express')

const router = express.Router()
// const router = require('express-promise-router')();
const homeController = require('../controllers/home.js')

/* GET home page. */
router.get('/', function (req, res, next) {
	const params = {
		active: { home: true },
	}

	res.render('home', params)
})
router.get('/joblist', homeController.getPublish)

module.exports = router
