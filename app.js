const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index');
const menRouter = require('./routes/men');
const womenRouter = require('./routes/women');
const singleProductRoute = require('./routes/singleProduct');
const searchRoute = require('./routes/search');
const signupRoute = require('./routes/signup');
const verifyRoute = require('./routes/emailverify');
const signinRoute = require('./routes/signin');
const addtocartRoute = require('./routes/addtocart');
const checkoutRoute = require('./routes/checkout');
const saveaddressRoute = require('./routes/saveaddressRoute');
const logoutRoute = require('./routes/logout');

const auth = require('./middleware/auth');
const checkSignin = require('./middleware/checkSignin');
const redirectIfSignin = require('./middleware/redirectIfSignin');

const app = express();
const PORT = 8000;

app.listen(PORT, () => {
  console.log('Server Started at http://localhost:8000/');
});

// static file access
app.use(express.static('public'));

// setting ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// non-auth-routes || checkSignin => to change the navbar dropdown menu accordingly
app.use('/', checkSignin, indexRouter);
app.use('/', checkSignin, menRouter);
app.use('/', checkSignin, womenRouter);
app.use('/', checkSignin, singleProductRoute);
app.use('/search', checkSignin, searchRoute);
app.use('/verify', checkSignin, verifyRoute);

app.use('/signup', checkSignin, redirectIfSignin, signupRoute);
app.use('/signin', checkSignin, redirectIfSignin, signinRoute);

app.use('/addtocart', auth, addtocartRoute);
app.use('/cart', auth, checkoutRoute);
app.use('/saveaddress', auth, saveaddressRoute);
app.use('/logout', auth, logoutRoute);

app.use('/', function (req, res, next) {
  return res.render('error');
});
