const router = require('express').Router();
const mysql = require('mysql2');
const pool = require("../db.js"); // db connection pool

// 상품에서 조회
router.get('/search/product', async (req, res) => {
    const { keyword } = req.query;

    // query문
    let sql = 'CALL product_search(?, 0)';

    try {
        // 상품에서 조회
        const query = mysql.format(sql, [keyword]);
        const [result] = await pool.query(query);

        res.send(result);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

// 사용자에서 조회
router.get('/search/user', async (req, res) => {
    let { keyword } = req.query;
    keyword = keyword.toLowerCase();

    // query문
    let sql = 'CALL user_search(?)';

    try {
        // 상품 전체 수 조회
        const query = mysql.format(sql, [keyword]);
        const [result] = await pool.query(query);
        
        res.send(result);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

// 게시판에서 조회
router.get('/search/board', async (req, res) => {
    const { keyword } = req.query;

    // query문
    let sql = 'CALL board_search(?)';

    try {
        // 상품 전체 수 조회
        const query = mysql.format(sql, [keyword]);
        const [result] = await pool.query(query);

        res.send(result);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

module.exports = router;