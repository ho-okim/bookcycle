const router = require('express').Router();
const pool = require("../db.js"); // db connection pool
const { isLoggedIn, isAdmin, isIdenticalUser } = require('../lib/auth.js');

// 내가 신고한 내역 조회
router.get('/report/myreport/', isLoggedIn, async (req, res) => {
    const id = req.user.id;
    
    // query문 설정
    let sql = 'SELECT * FROM report WHERE user_id = ?';

    try {
        // db connection pool을 가져오고, query문 수행
        let result = await pool.query(sql, [id]);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

// 신고내역 추가
router.post('/report', isLoggedIn, async (req, res) => {

    const {category, user_id, target_id, content, ownerId} = req.body;

    if (user_id == ownerId) {
        res.send('not allowed');
        return;
    }

    // query문 설정
    let sql = 'INSERT INTO report (category, user_id, target_id, content) VALUES (?, ?, ?, ?)';

    try {
        // db에 query문 실행
        let result = await pool.query(sql, [category, user_id, target_id, content]);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

// 신고내역 확인 및 처리 표시
router.get('/report/:id', isAdmin, async (req, res) => {
    const { id } = req.params;

    // query문 설정
    let sql = 'UPDATE report SET read_or_not = 1, updatedAt = current_timestamp WHERE id = ?';

    try {
        // db에 query문 실행
        let result = await pool.query(sql, [id]);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

module.exports = router;