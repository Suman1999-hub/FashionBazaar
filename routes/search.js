var express = require('express');
const pool = require('../pool');
var router = express.Router();

router.get('/', async function (req, res, next) {
  const searchItem = req.query.q;
  // console.log('search item : ' + searchItem);

  let items = [];

  try {
    // fetch from db
    const result =
      await pool.query(`select * from products where to_tsvector(name|| ' ' || details) 
        @@ plainto_tsquery('${searchItem}');`);

    // console.log(result.rows);
    items = result.rows;
  } catch (error) {
    console.log(error);
  }

  res.render('search', {
    isLogin: req.isLogin,
    text: searchItem,
    items,
  });
});

module.exports = router;
