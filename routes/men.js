var express = require('express');
const pool = require('../pool');
var router = express.Router();

router.get('/men/:id', async function (req, res, next) {
  const id = req.params.id;
  const currentPage = req.query.page ? parseInt(req.query.page) : 0;
  const nextPage = currentPage ? parseInt(currentPage) + 1 : 2;

  // console.log(id);
  // console.log(currentPage);
  // let text = menCatagoryCheck(id);

  const baseUrl = `men/${id}`;

  // fetch data from db
  // console.log(text);
  let items = [];

  try {
    const result = await pool.query(
      `select * from products where gender='men' and type='${id}';`
    );
    items = result.rows;
  } catch (error) {
    console.log(error);
  }

  // console.log(req.isLogin);

  if (id === 't-shirt' || id === 'shirt' || id === 'jeans' || id === 'watch') {
    return res.render('men', {
      text: id,
      baseUrl,
      nextPage,
      items,
      isLogin: req.isLogin,
    });
  }
  next();
});

module.exports = router;
