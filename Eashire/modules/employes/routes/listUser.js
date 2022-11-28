const _module = require('@employes')
const auth = require('@utils/authentication')
const router = require('express-promise-router')()

const listUser = _module.controller

router.get('/', auth.authenticated, listUser.getListUsers)

router.get

module.exports = router
