var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  // console.log(req.isLogin);

  res.render('index', { isLogin: req.isLogin });
});

module.exports = router;
