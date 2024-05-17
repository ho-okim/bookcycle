const router = require('express').Router();
const mysql = require('mysql2');
const pool = require("../db.js"); // db connection pool
const { isLoggedIn, isAdmin } = require('../lib/auth.js');

// 내가 신고한 내역 조회
router.get('/report/myreport/', isLoggedIn, async (req, res) => {
    const id = req.user.id;
    
    // query문 설정
    let sql = 'SELECT * FROM report WHERE user_id = ?';

    try {
        // db connection pool을 가져오고, query문 수행
        const query = mysql.format(sql, [id]);
        const result = await pool.query(query);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

// 신고 했는지 여부 확인
router.get('/report/reported/', isLoggedIn, async (req, res) => {
    const id = req.user.id;
    const { category, target_id } = req.query;

    // query문 설정
    let sql = 'SELECT COUNT(*) AS size FROM report WHERE user_id = ? AND category = ? AND target_id = ?';

    try {
        // db connection pool을 가져오고, query문 수행
        const query = mysql.format(sql, [id, category, parseInt(target_id)]);
        const result = await pool.query(query);

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
        const query = mysql.format(sql, [category, user_id, target_id, content]);
        const result = await pool.query(query);
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
        const query = mysql.format(sql, [id]);
        let result = await pool.query(query);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

module.exports = router;