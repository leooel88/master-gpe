const router = require('express-promise-router')();

const Test = require('../controllers/test');

router.get('/testurl', (req, res, next) => {
  res.render('testView');
})

router.get('/testcontroller', Test.getTest)

module.exports = router;