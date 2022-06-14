var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	let params = {
		active: { home: true },
	};

	res.render('home', params);
});

module.exports = router;
