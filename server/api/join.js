const router = require('express').Router();
const pool = require("../db.js");
const bcrypt = require("bcrypt");

// 이메일 중복 체크
router.get('/email', async (req, res) => {
    // request query string
    const { email } = req.query;
    
    let sql = 'SELECT * FROM users WHERE email = ?';

    let result = await pool.query(sql, [email]);
    res.send(result);
});

// 회원가입
router.post('/join', async (req, res) => {

    const { email, password, username, nickname, phone_number, profile_image, verification } = req.body;

    let sql = 'INSERT INTO users (role_id, email, password, username, nickname, phone_number, profile_image, verification) VALUES (2, ?, ?, ?, ?, ?, ?, ?)';

    console.log(req.body)
    
    let result = await pool.query(sql, [
        email, 
        await bcrypt.hash(password, 10),
        username, 
        nickname, 
        phone_number, 
        profile_image, 
        verification
    ]);
    
    res.send(result);
});

module.exports = router;