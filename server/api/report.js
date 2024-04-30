const router = require('express').Router();
const pool = require("../db.js"); // db connection pool

// 내가 신고한 내역 조회
router.get('/report/myreport/:userId', async (req, res) => {
    let { userId } = req.params;
    
    // query문 설정
    let sql = 'SELECT * FROM report WHERE user_id = ?';

    // db connection pool을 가져오고, query문 수행
    let result = await pool.query(sql, [userId]);
    res.send(result);
});

// 신고내역 추가
router.post('/report', async (req, res) => {

    const {category, user_id, target_id, content, ownerId} = req.body;

    if (user_id == ownerId) {
        res.send('not allowed');
        return;
    }

    // query문 설정
    let sql = 'INSERT INTO report (category, user_id, target_id, content) VALUES (?, ?, ?, ?)';

    // db에 query문 실행
    let result = await pool.query(sql, [category, user_id, target_id, content]);
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