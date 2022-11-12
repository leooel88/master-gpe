const router = require('express-promise-router')();

router.get('/testurl', (req, res, next) => {
  res.render('testView');
})

module.exports = router;