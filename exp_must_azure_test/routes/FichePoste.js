var express = require('express');
const router = require('express-promise-router')();

const fichePoste = require('../controller/FichePoste.js');

router.get('/', fichePoste.getPage);

router.post('/create', fichePoste.create);

module.exports = router;
