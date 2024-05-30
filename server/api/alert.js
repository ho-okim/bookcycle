const router = require('express').Router();
const mysql = require('mysql2');
const pool = require("../db.js"); // db connection pool
const { isLoggedIn } = require('../lib/auth.js');

// 내 알림 전체 가져오기
router.get('/alert', isLoggedIn, async (req, res) => {
    const {id} = req.user;

    // query문 설정
    let sql = 'SELECT * FROM user_alerts WHERE user_id = ? ORDER BY createdAt DESC';

    let review_sql = 'SELECT * FROM user_review_alerts WHERE user_id = ? ORDER BY createdAt DESC';

    try {
        // db connection pool을 가져오고, query문 수행
        const query = mysql.format(sql, [id]);
        const reivew_query = mysql.format(review_sql, [id]);

        const result = await pool.query(query);
        const review_result = await pool.query(reivew_query);

        let total = [...result, ...review_result].sort((a, b)=>{return new Date(b.createdAt - new Date(a.createdAt))});

        res.send(total);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

// 내 알림 최신순 10개 가져오기
router.get('/alert/short', isLoggedIn, async (req, res) => {
    const {id} = req.user;

    // query문 설정
    let sql = 'SELECT * FROM user_alerts WHERE user_id = ? ORDER BY createdAt DESC';

    let review_sql = 'SELECT * FROM user_review_alerts WHERE user_id = ? ORDER BY createdAt DESC';
    try {
        // db connection pool을 가져오고, query문 수행
        const query = mysql.format(sql, [id]);
        const reivew_query = mysql.format(review_sql, [id]);

        const result = await pool.query(query);
        const review_result = await pool.query(reivew_query);

        let total = [...result, ...review_result].sort((a, b)=>{return new Date(b.createdAt - new Date(a.createdAt))}).splice(0, 10);
        
        res.send(total);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

// 알림 읽음 처리
router.put('/alert/read/:id', isLoggedIn, async (req, res) => {
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