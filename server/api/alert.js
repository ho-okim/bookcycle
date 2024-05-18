const router = require('express').Router();
const mysql = require('mysql2');
const pool = require("../db.js"); // db connection pool
const { isLoggedIn } = require('../lib/auth.js');

// 내 알림 가져오기
router.get('/alert', isLoggedIn, async (req, res) => {
    const {id} = req.user;

    // query문 설정
    let sql = 'SELECT * FROM user_alerts WHERE user_id = ? ORDER BY createdAt DESC';

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

// 알림 읽음 처리
router.put('/alert/read', isLoggedIn, async (req, res) => {
    const {id} = req.params;

    // query문 설정
    let sql = 'UPDATE alert SET read_or_not = 1 WHERE id = ?';

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

module.exports = router;