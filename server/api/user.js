const router = require('express').Router();
const pool = require("../db.js"); // db connection pool

// 특정 사용자 조회
router.get('/user/:userId', async (req, res) => {
    const {userId} = req.params;

    // query문 설정
    let sql = 'SELECT * FROM users WHERE id = ?';

    // db connection pool을 가져오고, query문 수행
    const result = await pool.query(sql, [userId]); // query문의 결과는 배열로 들어오기 때문에 주의해야 함

    const { nickname, profile_image, manner_score } = result[0];

    // client로 보낼 데이터
    const body = { userId, nickname, profile_image, manner_score };

    res.send(body);
});

// 특정 사용자의 판매목록 전체 수 조회
router.get('/user/:userId/productAll', async (req, res) => {
    const {userId} = req.params;
    
    // query문
    let sql = `SELECT COUNT(*) AS total FROM product WHERE seller_id = ?`;

    // 상품 전체 수 조회
    const body = await pool.query(sql, [userId]);

    res.send(body);
});

// 특정 사용자의 판매목록 조회
router.get('/user/:userId/product', async (req, res) => {
    const {userId} = req.params;
    const {offset, limit} = req.query;
    
    // query문
    let sql = `SELECT * FROM product_simple_data WHERE seller_id = ? ORDER BY createdAt DESC LIMIT ${limit} OFFSET ${offset}`;

    // 상품 목록 조회
    const body = await pool.query(sql, [userId]);

    res.send(body);
});

// 특정 판매자의 상품에 대한 review 전체 수 조회
router.get('/user/:userId/reviewAll', async (req, res) => {
    const {userId} = req.params;
    
    // query문
    let sql = `SELECT COUNT(*) AS total FROM user_review WHERE seller_id = ?`;

    // 상품 전체 수 조회
    const body = await pool.query(sql, [userId]);

    res.send(body);
});

// 특정 판매자의 상품에 대한 review 조회
router.get('/user/:userId/review', async (req, res) => {
    const {userId} = req.params;
    const {offset, limit} = req.query;

    // query문 설정
    let sql = `SELECT * FROM user_review WHERE seller_id = ? ORDER BY createdAt DESC LIMIT ${limit} OFFSET ${offset}`;

    // db connection pool을 가져오고, query문 수행
    const result = await pool.query(sql, [userId]); // query문의 결과는 배열로 들어오기 때문에 주의해야 함

    res.send(result);
});

// 특정 판매자에 대한 review와 review tag 조회 - 5개씩 추가 조회
router.get('/user/:userId/reviewtag', async (req, res) => {
    const {userId} = req.params;
    const {limit, offset} = req.query;

    // query문 설정
    let sql = `SELECT *, count(*) AS size FROM review_tag_list WHERE seller_id = ? GROUP BY tag_id ORDER BY size DESC LIMIT ${limit} OFFSET ${offset}`;

    // db connection pool을 가져오고, query문 수행
    const result = await pool.query(sql, [userId]); // query문의 결과는 배열로 들어오기 때문에 주의해야 함

    res.send(result);
});

module.exports = router;