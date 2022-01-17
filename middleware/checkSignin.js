// this function check the user is sign in or not
// based on that we change the ui (navbar)

const pool = require('../pool');
const jwt = require('jsonwebtoken');

const JWT_SECRET = `ohadfohf#@()(&isahfd)29df71afd2f3#!23dfdfkjsf`;

const checkSignin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_token;

    if (!token) throw new Error('user is not available');

    const verifyUser = jwt.verify(token, JWT_SECRET);
    // console.log(verifyUser.id);

    // check database for this user
    const result = await pool.query(
      `select * from users where user_id='${verifyUser.id}'`
    );
    // console.log(result.rows[0]);

    if (result.rows.length === 0) {
      throw new Error('user is not available');
    }
    // console.log('isLogin is true');
    req.isLogin = true;

    next();
  } catch (error) {
    // console.log('cookie is not present');
    req.isLogin = false;
    next();
  }
};

module.exports = checkSignin;
