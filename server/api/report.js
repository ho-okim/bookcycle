const router = require('express').Router();
const pool = require("../db.js"); // db connection pool

// 신고내역 조회
router.get('/report/:id', async (req, res) => {
    let { id } = req.params;
    
    // query문 설정
    let sql = 'SELECT * FROM report WHERE id = ?';

    // db connection pool을 가져오고, query문 수행
    let result = await pool.query(sql, [id]);
    res.send(result);
});

// 신고내역 추가
router.post('/report', async (req, res) => {

    const {category_id, user_id, target_id, content} = req.body;

    // query문 설정
    let sql = 'INSERT INTO report (category_id, user_id, target_id, content) VALUES (?, ?, ?, ?)';

    // db에 query문 실행
    let result = await pool.query(sql, [category_id, user_id, target_id, content]);
    res.send(result);
});

// 신고내역 확인 및 처리 표시
router.put('/report/:id', async (req, res) => {
    const { id } = req.params;

    // query문 설정
    let sql = 'UPDATE report SET read_or_not = 1, updatedAt = current_timestamp WHERE id = ?';

    // db에 query문 실행
    let result = await pool.query(sql, [id]);
    res.send(result);
});

module.exports = router;