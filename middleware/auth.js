const jwt = require('jsonwebtoken');
const pool = require('../pool');

const JWT_SECRET = `ohadfohf#@()(&isahfd)29df71afd2f3#!23dfdfkjsf`;

const auth = async (req, res, next) => {
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

    req.userId = result.rows[0].user_id;

    next();
  } catch (error) {
    // console.log('user in not log in');
    return res.redirect('/');
  }
};

module.exports = auth;
