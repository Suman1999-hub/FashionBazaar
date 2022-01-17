var express = require('express');
const pool = require('../pool');
var router = express.Router();

router.get('/', async function (req, res, next) {
  // fetch cart product from db

  // console.log('userid within checkout' + req.userId);

  const result =
    await pool.query(`select products.product_id, name, img_url, price, count from products 
            inner join 
            (select * from cart where user_id=${req.userId}) as b 
            on b.product_id = products.product_id;`);

  // console.log(result.rows);

  let totalCount = 0;
  let totalPrice = 0;

  result.rows.map((item) => {
    totalCount += item.count;
    totalPrice += item.price * item.count;
  });

  // fetch user address
  const address = await pool.query(
    `select * from users where user_id=${req.userId}`
  );

  // console.log('Total Count : ' + totalCount);
  // console.log('Total Price : ' + totalPrice);

  const orderPlaced = req.query.orderPlaced;
  // console.log('orderPlaced : ' + orderPlaced);

  res.render('cart', {
    isLogin: req.isLogin,
    items: result.rows,
    address: address.rows[0],
    totalCount,
    totalPrice,
    orderPlaced,
  });
});

router.post('/placeorder', async function (req, res, next) {
  const userId = req.userId;
  let orderPlaced = false;

  // console.log('place order');

  try {
    // check db for address
    const result = await pool.query(
      `select * from users where user_id=${userId}`
    );
    const { customer_name, ph_no, city, state, landmark, zip_code } =
      result.rows[0];

    // console.log({ customer_name, ph_no, city, state, landmark, zip_code });

    if (!customer_name || !ph_no || !city || !state || !landmark || !zip_code) {
      throw new Error('Address not properly given');
    }

    // remove items from cart || order placed
    await pool.query(`delete from cart where user_id=${userId}`);
    orderPlaced = true;
  } catch (error) {
    console.log(error);
    orderPlaced = false;
  }

  return res.redirect(`/cart?orderPlaced=${orderPlaced}`);
});

router.post('/', async function (req, res, next) {
  const userId = req.userId;

  if (req.body.actionType === 'placeOrder') {
    return res.redirect('/cart');
  }

  // console.log('incrementCount : ' + req.body.productId + req.body.actionType);
  const { productId, actionType } = req.body;

  if (actionType === 'increment') {
    await pool.query(
      `update cart set count = count+1 where product_id=${productId} and user_id=${userId}`
    );
  } else if (actionType === 'decrement') {
    await pool.query(
      `update cart set count = count-1 where product_id=${productId} and user_id=${userId} and count > 1`
    );
  } else {
    await pool.query(
      `delete from cart where product_id=${productId} and user_id=${userId}`
    );
  }

  return res.redirect('/cart');
});

module.exports = router;
