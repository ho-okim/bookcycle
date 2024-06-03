require('dotenv').config();
const nodemailer = require('nodemailer');
const router = require('express').Router();
const mysql = require('mysql2');
const pool = require("../db.js");
const bcrypt = require("bcrypt");
const { isNotLoggedIn } = require('../lib/auth.js');
const {generateRandomNumber} = require('../lib/generateRandom.js');
const authHtml = require('../html/authHtml.js');

const hostname = process.env.HOSTNAME || 'localhost';

// 이메일 중복 체크
router.get('/email', isNotLoggedIn, async (req, res) => {
  // request query string
  const { email } = req.query;
  
  const decodedEmail = decodeURIComponent(email);
  
  let sql = 'SELECT COUNT(*) AS size FROM users WHERE email = ?';

  try {
    const query = mysql.format(sql, [decodedEmail]);
    const result = await pool.query(query);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('error');
  }
});

// 회원가입
router.post('/join', isNotLoggedIn, async (req, res) => {

  const { email, password, username, nickname, phone_number } = req.body;
  
  // 인증키 생성
  const token = await bcrypt.hash(generateRandomNumber().toString(), 10);
  const encodeToken = encodeURIComponent(token);

  // 이메일 html
  const emailHtml = authHtml(encodeToken);

  const sendMail =  async (email) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_OAUTH_USER,
          pass: process.env.APP_PASSWORD
        },
      });
  
      const mailOptions = {
        from: {
          name: "BookCycle",
          address: process.env.GMAIL_OAUTH_USER
        },
        to: email,
        subject: "[북사이클] 회원가입 인증 메일입니다.",
        html: emailHtml,
        attachments: [{
          filename: 'bookcycle-logo.png',
          path: `http://${hostname}:3000/img/bookcycle-logo.png`,
          cid: 'provide@bookcycle-logo.png'
        }]
      };
  
      await transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
          res.status(500).send('email send error');
        } else {
          console.log('email succecfully sended');
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  console.log('----------send mail-----------');
  // 메일 전송
  sendMail(email);

  // 회원 정보 등록 쿼리
  let user_sql = 'INSERT INTO users (email, password, username, nickname, phone_number) VALUES (?, ?, ?, ?, ?)';

  // 인증 정보 쿼리
  let verify_sql = 'INSERT INTO verification (user_id, secured_key, date_expired) VALUES (?, ?, ?)';

  // 만료일
  const date_expired = new Date();
  date_expired.setHours(date_expired.getHours() + 24); // 24시간 후 링크 만료

  //console.log(req.body)
  try {
    // 회원 등록
    const user_query = mysql.format(user_sql, [
      email, 
      await bcrypt.hash(password, 10),
      username, 
      nickname, 
      phone_number
    ]);
    const result = await pool.query(user_query);
    
    const verify_query = mysql.format(verify_sql, [result.insertId, token, date_expired]);
    const verify_result = await pool.query(verify_query);
    
    if (result.affectedRows === 1 && verify_result.affectedRows === 1) {
      res.send('success');
    } else {
      // 한쪽에는 데이터 들어가고 다른쪽에 안 들어갈 수 있으므로 둘 다 조회 후 제거 동작 필요
      if (result) {
        let userDel_sql = 'DELETE FROM users WHERE id = ?';
        try {
          const userDel_query = mysql.format(userDel_sql, [result.insertId]);
          await pool.query(userDel_query);
          console.log('success deleting registered user info');
        } catch (error) {
          console.error(error);
          console.log('failed to delete registered user info');
        }
      }
      res.send('failed');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('error');
  }
});

// verify API
router.get('/email/verify', isNotLoggedIn, async(req, res)=>{
  const { token } = req.query;
  
  const decodedToken = decodeURIComponent(token);

  let verify_sql = 'SELECT * FROM user_verification WHERE secured_key = ?';

  try {
    // 쿼리스트링으로 들어온 securedKey로 테이블에 조회
    const verify_query = mysql.format(verify_sql, [decodedToken]);
    let [result] = await pool.query(verify_query);
    let dateNow = new Date();

    if (!result) {
      res.status(400).redirect(`http://${hostname}:3000/verify/notfound?v=1`);
    } else if(dateNow <= new Date(result.date_expired)) {
      // 쿼리스트링으로 들어온 token이 존재하고, 만료기한 내에 접근했다면 인증 완료 처리
      
      // 사용자 인증 여부 수정
      let user_sql = 'UPDATE users SET verification = 1 WHERE id = ?';
      // 인증 테이블의 데이터 제거
      let verifyRM_sql = 'DELETE FROM verification WHERE secured_key = ?';

        try {
          const user_query = mysql.format(user_sql, [result.user_id]);
          const user_result = await pool.query(user_query);

          const verifyRM_query = mysql.format(verifyRM_sql, [decodedToken]);
          const verifyRM_result = await pool.query(verifyRM_query);

          if (user_result.affectedRows === 1 && verifyRM_result.affectedRows === 1) {
            res.redirect(`http://${hostname}:3000/verify/confirmed?v=1`);
          }
        } catch (error) {
          console.error(error);
          res.status(500).redirect(`http://${hostname}:3000/verify/error?v=1`);
        }
    } else {
      res.status(401).redirect(`http://${hostname}:3000/verify/expired?v=1`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).redirect(`http://${hostname}:3000/verify/error`);
  }
});

module.exports = router;