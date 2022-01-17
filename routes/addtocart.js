var express = require('express');
const pool = require('../pool');
var router = express.Router();

router.post('/', async function (req, res, next) {
  // console.log(req.body);

  const { productId } = req.body;
  const userId = req.userId;

  console.log({ productId, userId });

  try {
    // to get the count of the product
    const count = await pool.query(
      `select count from cart where product_id='${productId}' and user_id='${userId}'`
    );
    // console.log(count.rows);

    const updatedCount = count.rows.length === 0 ? 1 : count.rows[0].count + 1;

    if (updatedCount > 1) {
      // to update the data
      const response = await pool.query(
        `update cart set count = '${updatedCount}' 
        where product_id='${productId}' and user_id='${userId}'`
      );
    } else {
      // to insert the data
      const response = await pool.query(
        `insert into cart (product_id, user_id, count) 
        values ('${productId}', '${userId}', '${updatedCount}')`
      );
    }
  } catch (error) {
    console.log(error);
  }

  return res.json({ status: 'ok' });
});

module.exports = router;
