const router = require('express-promise-router')();

const listUser = require('../controller/listUsers.js');

router.get('/', listUser.getListUsers);

router.get;

module.exports = router;
