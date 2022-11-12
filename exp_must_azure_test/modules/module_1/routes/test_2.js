const router = require('express-promise-router')();

router.get('/testurl2', (req, res, next) => {
  res.render('testView2');
})

module.exports = router;