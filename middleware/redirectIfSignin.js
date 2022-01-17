const redirectIfSignin = (req, res, next) => {
  console.log('redirectIfSignin :' + req.isLogin);
  if (req.isLogin === true) {
    return res.redirect('/');
  }

  next();
};

module.exports = redirectIfSignin;
