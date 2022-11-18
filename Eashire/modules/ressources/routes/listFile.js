const _module = require('@ressources')
const router = require('express-promise-router')()

const listFile = _module.controller

router.get('/', listFile.getListFile)
router.post('/delete', listFile.deleteFile)

module.exports = router
