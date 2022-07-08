var express = require('express');
const router = require('express-promise-router')();

const dashboardController = require('../controller/Dashboard.js');

router.get('/', dashboardController.getPage);

module.exports = router;
