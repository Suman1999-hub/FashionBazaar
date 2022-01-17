var express = require('express');
const pool = require('../pool');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var router = express.Router();

const JWT_SECRET = `ohadfohf#@()(&isahfd)29df71afd2f3#!23dfdfkjsf`;

router.get('/', function (req, res, next) {
  return res.render('signin');
});

router.post('/', async function (req, res, next) {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      `select * from users where email='${email}'`
    );

    // console.log(result.rows);

    if (result.rows.length === 0) {
      throw new Error('User does not exist');
    }

    // console.log(result.rows[0].verify_token);

    if (result.rows[0].verify_token) throw new Error('Email is not verified');

    const isCorrectPassword = await bcrypt.compare(
      password,
      result.rows[0].password
    );

    if (isCorrectPassword) {
      // console.log('password match');

      const token = jwt.sign(
        {
          id: result.rows[0].user_id,
        },
        JWT_SECRET
      );

      // set the cookie
      res.cookie('jwt_token', token, { httpOnly: true });

      // save the token to database
      // await pool.query(
      //   `update users set jwt_token = array_append(jwt_token, 'token3') where id=44;`
      // );

      // return res.render('signin');
      return res.redirect('/');
    } else {
      // console.log('password donot match');
      return res.render('signin', {
        errorMessage: 'Email or Password does not match',
      });
    }
  } catch (error) {
    return res.render('signin', {
      errorMessage: error,
    });
  }

  // return res.render('signin');
});

module.exports = router;
