var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  // console.log(req.isLogin);

  // remove the cookie from client
  res.clearCookie('jwt_token');

  res.redirect('/');
});

module.exports = router;
