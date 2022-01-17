var express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../pool');
const cryptoRandomString = require('crypto-random-string');
const nodemailer = require('../util/nodemailer');
var router = express.Router();

router.get('/', function (req, res, next) {
  // console.log('get signup');

  res.render('signup');
});

router.post('/', async function (req, res, next) {
  // console.log('post signup');
  // console.log(req.body);

  let { name, email, password } = req.body;

  let errorObj = {
    errorName: false,
    errorEmail: false,
  };
  let valueObj = {
    name,
    email,
    password,
  };

  accountCreated = false;

  if (!valueObj.name.match(/^[a-zA-Z ]*$/)) {
    errorObj.errorName = true;
  } else if (
    !valueObj.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
  ) {
    errorObj.errorEmail = true;
  }

  const newPassword = await bcrypt.hash(password, 10);

  if (errorObj.errorName === false && errorObj.errorEmail === false) {
    valueObj.name = '';
    valueObj.email = '';
    valueObj.password = '';
    // console.log('post no error');

    email = email.toLowerCase();

    try {
      const confirmationToken = cryptoRandomString({
        length: 10,
        type: 'url-safe',
      });
      const res = await pool.query(
        `INSERT INTO users (name, password, email, verify_token) 
        VALUES 
        ('${name}', '${newPassword}', '${email}', '${confirmationToken}') RETURNING *;`
      );
      const userId = res.rows[0].user_id;

      // console.log(confirmationToken + ':confirmation token');

      // console.log('db insert no err');

      nodemailer.sendConfirmationEmail(name, email, userId, confirmationToken);
    } catch (error) {
      console.log(error.message + ':error in catch');
      if (error.code === '23505')
        return res.render('signup', {
          errorMessage: 'Account already exist',
        });
    }
    return res.render('signup', { accountCreated: true });
  }

  return res.render('signup', {
    errorObj,
    valueObj,
    accountCreated: false,
  });
});

module.exports = router;
