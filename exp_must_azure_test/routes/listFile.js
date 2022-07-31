const router = require('express-promise-router')();

const listFile = require('../controller/listFile.js');
const { get } = require('./home.js');

router.get('/', listFile.getListFile);
router.delete('/:filename',listFile.deleteFile);
module.exports = router;