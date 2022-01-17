var express = require('express');
const pool = require('../pool');
var router = express.Router();

router.get('/women/:id', async function (req, res, next) {
  const id = req.params.id;
  const currentPage = req.query.page ? parseInt(req.query.page) : 0;
  const nextPage = currentPage ? parseInt(currentPage) + 1 : 2;

  // console.log(id);
  // console.log(currentPage);
  // let text = womenCatagoryCheck(id);

  const baseUrl = `women/${id}`;

  // fetch data from db
  // console.log(text);
  let items = [];

  try {
    const result = await pool.query(
      `select * from products where gender='women' and type='${id}';`
    );
    items = result.rows;
  } catch (error) {
    console.log(error);
  }

  // console.log(req.isLogin);

  // verify id type
  if (id === 't-shirt' || id === 'jeans' || id === 'saree' || id === 'kurti') {
    return res.render('women', {
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
