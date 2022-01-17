var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
  // console.log('incrementCount : ' + req.body.productId);

  return res.redirect('/checkout', { isLogin: req.isLogin });
});

module.exports = router;
