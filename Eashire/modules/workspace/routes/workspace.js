const auth = require('@utils/authentication')
const _module = require('@workspace')
const router = require('express-promise-router')()

const workspaceController = _module.controller

router.get('/workspace', auth.authenticated, workspaceController.getWorkspacePage)

module.exports = router
