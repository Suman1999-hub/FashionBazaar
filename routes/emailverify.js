var express = require('express');
const pool = require('../pool');
var router = express.Router();

router.get('/:userid/:confirmationToken', async function (req, res, next) {
  const { userid, confirmationToken } = req.params;
  // console.log(userid);
  // console.log(confirmationToken);

  // verify at database

  try {
    const res = await pool.query(
      `update users set verify_token=${null} where user_id=${userid} and verify_token='${confirmationToken}';`
    );
    // console.log(res);
    if (res.rowCount === 0) throw new Error('Not able to verify email');
  } catch (error) {
    return res.render('verify-email', { error: true, isLogin: req.isLogin });
  }

  res.render('verify-email', { isLogin: req.isLogin });
});

module.exports = router;
