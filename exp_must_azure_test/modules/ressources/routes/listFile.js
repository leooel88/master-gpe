const router = require('express-promise-router')()

const { get } = require('../../home/routes/home.js')
const listFile = require('../controllers/listFile.js')

router.get('/', listFile.getListFile)
// router.delete('/:filename',listFile.deleteFile);
router.post('/delete', listFile.deleteFile)
module.exports = router
