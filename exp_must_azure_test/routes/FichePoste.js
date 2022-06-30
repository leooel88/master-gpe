var express = require('express');
const router = require('express-promise-router')();

const fichePoste = require('../controller/FichePoste.js');

router.get('/', function (req, res, next) {
	let params = {
		active: { fichePoste: true },
	};
	res.render('fichePoste');
});

router.post('/create', fichePoste.create);

module.exports = router;
