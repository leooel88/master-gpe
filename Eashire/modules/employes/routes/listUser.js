const _module = require('@employes')
const router = require('express-promise-router')()

const listUser = _module.controller

router.get('/', listUser.getListUsers)

router.get

module.exports = router
