const router = require('express').Router();
const pool = require("../db.js"); // db connection pool
const { CHAR_REG } = require('../lib/regex_server.js');

// 특정 사용자 조회
router.get('/user/:userId', async (req, res) => {
    const {userId} = req.params;

    // query문 설정
    let sql = 'SELECT id, nickname, profile_image, manner_score FROM users WHERE id = ?';

    try {
        // db connection pool을 가져오고, query문 수행
        const result = await pool.query(sql, [parseInt(userId)]); // query문의 결과는 배열로 들어오기 때문에 주의해야 함
        const { nickname, profile_image, manner_score } = result[0];
        // client로 보낼 데이터
        const body = { userId, nickname, profile_image, manner_score };
        res.send(body);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

// 특정 사용자의 판매목록 전체 수 조회
router.get('/user/:userId/productAll', async (req, res) => {
    const {userId} = req.params;
    const { sold, category_id } = req.query;

    // query문
    let sql = `SELECT COUNT(*) AS total FROM product WHERE seller_id = ?`;
    let variables = [parseInt(userId)];
    
    if (sold === 'NOT NULL') {
        sql += ' AND soldDate IS NOT NULL';
    }
    if (parseInt(category_id) !== 0) {
        sql += ' AND category_id = ?';
        variables.push(parseInt(category_id));
    }

    try {
        // 상품 전체 수 조회
        const body = await pool.query(sql, variables );
        res.send(body);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

// 특정 사용자의 판매목록 조회
router.get('/user/:userId/product', async (req, res) => {
    const { userId } = req.params;
    const { limit, offset, name, ascend, sold, category_id } = req.query;

    let newName = CHAR_REG.test(name) ? name.trim() : 'createdAt';

    let updown = (ascend == 'true') ? 'ASC' : 'DESC'; // boolean -> string 주의
    
    try {
        // query문
        let sql = 'SELECT * FROM product_simple_data WHERE seller_id = ?';
        let variables = [userId];
    
        if (sold === 'NOT NULL') {
            sql += ' AND soldDate IS NOT NULL';
        }
        if (parseInt(category_id) !== 0) {
            sql += ' AND category_id = ?';
            variables.push(parseInt(category_id));
        }
        let order_sql = ` ORDER BY ${newName} ${updown} LIMIT ? OFFSET ?`;
        // name string 에러
        variables.push(parseInt(limit), parseInt(offset));

        // 상품 목록 조회
        const body = await pool.query(sql+order_sql, variables);
        res.send(body);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

// 특정 사용자의 review 전체 수 조회
router.get('/user/:userId/reviewAll', async (req, res) => {
    const {userId} = req.params;
    const {type} = req.query;
    
    const tradeType = type.toLowerCase();

    let variables = [parseInt(userId)];

    // query문
    let sql = 'SELECT COUNT(*) AS total FROM trade_review WHERE writer_id != ?';

    if (tradeType === 'buy') {
        sql += ' AND buyer_id = ?';
        variables.push(parseInt(userId));
    } else if (tradeType === 'sell') {
        sql += ' AND seller_id = ?';
        variables.push(parseInt(userId));
    }

    try {
        // 상품 전체 수 조회
        const [result] = await pool.query(sql, variables);

        res.send(result);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

// 특정 사용자의 review 조회
router.get('/user/:userId/review', async (req, res) => {
    const { userId } = req.params;
    const { type, limit, offset, name, ascend } = req.query;

    const tradeType = type.toLowerCase();

    let newName = CHAR_REG.test(name) ? name.trim() : 'createdAt';
    let updown = (ascend == 'true') ? 'ASC' : 'DESC'; // boolean -> string 주의
    
    let variables = [parseInt(userId)];

    // query문 설정
    let sql = 'SELECT * FROM trade_review WHERE writer_id != ?';

    let order_sql = ` ORDER BY ${newName} ${updown} LIMIT ? OFFSET ?`;

    if (tradeType === 'buy') {
        sql += ' AND buyer_id = ?';
        variables.push(parseInt(userId));
    } else if (tradeType === 'sell') {
        sql += ' AND seller_id = ?';
        variables.push(parseInt(userId));
    }
    
    variables.push(parseInt(limit), parseInt(offset));

    try {
        // db connection pool을 가져오고, query문 수행
        const result = await pool.query(sql+order_sql, variables);

        res.send(result);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

// 특정 판매자에 대한 review와 review tag 전체 수 조회
router.get('/user/:userId/reviewTagTotal', async (req, res) => {
    const {userId} = req.params;

    // query문 설정
    let sql = 'SELECT COUNT(*) AS total FROM (SELECT COUNT(*) FROM review_tag_list WHERE seller_id = ? GROUP BY tag_id) AS subquery';

    try {
        // db connection pool을 가져오고, query문 수행
        const [result] = await pool.query(sql, [userId]);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

// 특정 판매자에 대한 review와 review tag 조회 - 5개씩 추가 조회
router.get('/user/:userId/reviewtag', async (req, res) => {
    const {userId} = req.params;
    const {limit, offset} = req.query;

    // query문 설정
    let sql = 'SELECT tag_id, tag_name, count(*) AS size FROM review_tag_list WHERE seller_id = ? GROUP BY tag_id ORDER BY size DESC LIMIT ? OFFSET ?';

    try {
        // db connection pool을 가져오고, query문 수행
        const result = await pool.query(sql, [userId, parseInt(limit), parseInt(offset)]); // query문의 결과는 배열로 들어오기 때문에 주의해야 함
        res.send(result);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

module.exports = router;