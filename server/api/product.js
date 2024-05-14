const router = require('express').Router();
const pool = require("../db.js"); // db connection pool
const { CHAR_REG } = require('../lib/regex_server.js');

// 상품 전체 수 조회
router.get('/productList/all', async (req, res) => {
    const { category_id, condition } = req.query;

    // query문
    let sql = 'SELECT COUNT(*) AS total FROM product WHERE soldDate IS NULL';
    let variables = [];

    if (parseInt(category_id) !== 0) {
        sql += ' AND category_id = ?';
        variables.push(parseInt(category_id));
    }
    if (condition !== 'all') {
        sql += ' AND `condition` LIKE ?';
        variables.push(condition);
    }

    try {
        // 상품 전체 수 조회
        const result = await pool.query(sql, variables);

        res.send(result);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

// 상품 목록 조회
router.get('/productList/product', async (req, res) => {
    const { limit, offset, name, ascend, category_id, condition } = req.query;

    let newName = CHAR_REG.test(name) ? name.trim() : 'createdAt';
    
    try {
        // query문
        let sql = 'SELECT * FROM product_detail WHERE soldDate IS NULL';
        let variables = [];

        if (parseInt(category_id) !== 0) {
            sql += ' AND category_id = ?';
            variables.push(parseInt(category_id));
        }
        if (condition !== 'all') {
            sql += ' AND `condition` LIKE ?';
            variables.push(condition);
        }
        
        let order_sql = ` ORDER BY ${newName} ${ascend} LIMIT ? OFFSET ?`;
        variables.push(parseInt(limit), parseInt(offset));

        // 상품 목록 조회
        const body = await pool.query(sql+order_sql, variables);
        res.send(body);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

router.get('/productDetail/:id', async (req, res) => {
    // query문 설정
    let sql = "SELECT * FROM product ORDER BY createdAt DESC LIMIT 5";

    // db connection pool을 가져오고, query문 수행
    let result = await pool.query(sql);
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