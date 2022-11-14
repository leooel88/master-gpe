const router = require('express-promise-router')()

const organigramme = require('../controllers/Organigramme.js')

router.get('/', organigramme.getOrganigrammePage)

router.get

module.exports = router
