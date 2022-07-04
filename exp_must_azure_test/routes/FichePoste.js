var express = require('express');
const router = require('express-promise-router')();

const fichePoste = require('../controller/FichePoste.js');

router.get('/', function (req, res, next) {
	let { error } = req.query;

	let params = {
		active: { fichePoste: true },
		currentDate: new Date().toISOString().split('T')[0],
	};
	if (error != null && error.length > 0) {
		params.error = [{ message: error }];
	}
	res.render('fichePoste', params);
});

router.post('/create', fichePoste.create);

module.exports = router;
