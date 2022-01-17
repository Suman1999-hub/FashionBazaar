var express = require('express');
const pool = require('../pool');
var router = express.Router();

router.get('/men/:catagory/:id', async function (req, res, next) {
  // console.log(req.params);

  const catagory = req.params.catagory;
  const productId = req.params.id;

  // const text = menCatagoryCheck(catagory);

  // verify catagory

  if (!catagory) return res.status(404).render('error');

  // console.log({ text, productId });

  // fetch data from db using productId
  let item = [];

  try {
    item = await pool.query(
      `select * from products where product_id='${productId}' and type='${catagory}'`
    );
    // console.log(item);
  } catch (error) {
    console.log(error);
  }

  if (item.rows.length === 0) {
    return res.render('error');
  }

  return res.render('single-product', {
    isLogin: req.isLogin,
    item: item.rows[0],
  });
});

router.get('/women/:catagory/:id', async function (req, res, next) {
  // console.log(req.params);

  const catagory = req.params.catagory;
  const productId = req.params.id;

  // const text = womenCatagoryCheck(catagory);

  if (!catagory) return res.status(404).render('error');

  // console.log({ text, productId });

  // fetch data from db using productId
  let item = [];

  try {
    item = await pool.query(
      `select * from products where product_id='${productId}' and type='${catagory}'`
    );
    // console.log(item.rows[0]);
  } catch (error) {
    console.log(error);
  }

  if (item.rows.length === 0) {
    return res.render('error');
  }

  return res.render('single-product', {
    isLogin: req.isLogin,
    item: item.rows[0],
  });
});

module.exports = router;
