const _module = require('@organigramme')
const auth = require('@utils/authentication')
const router = require('express-promise-router')()

const organigramme = _module.controller

router.get('/', auth.authenticated, organigramme.getOrganigrammePage)

router.get

module.exports = router
