
const router = require('express-promise-router')();

const listFile = require('../controllers/listFile.js');
const { get } = require('../../home/routes/home.js');

router.get('/', listFile.getListFile);
//router.delete('/:filename',listFile.deleteFile);
router.post('/delete', listFile.deleteFile);
module.exports = router;