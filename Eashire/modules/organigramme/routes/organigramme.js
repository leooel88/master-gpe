const _module = require('@organigramme')
const router = require('express-promise-router')()

const organigramme = _module.controller

router.get('/', organigramme.getOrganigrammePage)

router.get

module.exports = router
