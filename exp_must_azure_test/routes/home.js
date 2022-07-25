var express = require('express');
var router = express.Router();
// const router = require('express-promise-router')();
const fichePoste = require('../controller/FichePoste.js');

/* GET home page. */
router.get('/', function (req, res, next) {
	let params = {
		active: { home: true },
	};

	res.render('home', params);
});
router.get('/joblist', fichePoste.getPublish);

module.exports = router;
