var express = require('express');
const pool = require('../pool');
var router = express.Router();

router.post('/', async function (req, res, next) {
  const { customer_name, ph_no, city, state, zip, landmark } = req.body;
  const userId = req.userId;

  // console.log({ customer_name, ph_no, city, state, zip, landmark });

  try {
    await pool.query(
      `update users set
            customer_name='${customer_name}',
            ph_no='${ph_no}',
            city='${city}',
            state='${state}',
            zip_code='${zip}',
            landmark='${landmark}'
        where user_id=${userId}
        `
    );
  } catch (error) {
    console.log(error);
  }

  res.json({ status: 'ok' });
});

module.exports = router;
