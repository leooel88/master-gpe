const router = require('express-promise-router')();

const listUser = require('../controllers/listUsers.js');

router.get('/', listUser.getListUsers);

router.get;

module.exports = router;
