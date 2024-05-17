const router = require('express').Router();
const pool = require("../db.js"); // db connection pool
const mysql = require('mysql2');

router.get('/productList', async (req, res) => {
    // query문 설정
    let sql = "SELECT * FROM product ORDER BY createdAt DESC LIMIT 5";

    // db connection pool을 가져오고, query문 수행
    let result = await pool.query(sql);
    res.send(result);
});

router.get('/productDetail/:id', async (req, res) => {
    const { id } = req.params;
    
    // query문 설정
    let sql = "SELECT * FROM product_detail WHERE product_id = ?";

    // db connection pool을 가져오고, query문 수행
    const query = mysql.format(sql, [id]);
    let [result] = await pool.query(query); //보안상을 위하여 query 문 작성하게 될 때 이런 식으로 할 것
    res.send(result);
});

// 상품 카테고리 조회
router.get('/product/category', async (req, res) => {
    // query문 설정
    let sql = "SELECT * FROM product_category";

    // db connection pool을 가져오고, query문 수행
    let result = await pool.query(sql);
    res.send(result);
});

router.delete('/', (req, res) => {

});

module.exports = router;