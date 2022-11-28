const _module = require('@ressources')
const auth = require('@utils/authentication')
const router = require('express-promise-router')()

const listFile = _module.controller

router.get('/', listFile.getListFile)
router.post('/delete', listFile.deleteFile)

module.exports = router
