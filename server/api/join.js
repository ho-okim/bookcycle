require('dotenv').config()
const nodemailer = require('nodemailer')

const router = require('express').Router();
const pool = require("../db.js");
const bcrypt = require("bcrypt");
const { isNotLoggedIn } = require('../lib/auth.js');

// 이메일 인증 링크 전용 8자리 난수 생성 코드
const emailVerifyToken = (min = 11111111, max = 99999999) => {
  const token = Math.floor(Math.random() * (max - min + 1) + min)
  const expires = new Date()
  expires.setHours(expires.getHours() + 24) // 24시간 후 링크 만료

  return token
}

// 이메일 중복 체크
router.get('/email', isNotLoggedIn, async (req, res) => {
  // request query string
  const { email } = req.query;
  
  let sql = 'SELECT * FROM users WHERE email = ?';

  try {
    let result = await pool.query(sql, [email]);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});

// 회원가입
router.post('/join', isNotLoggedIn, async (req, res) => {

  const { email, password, username, nickname, phone_number } = req.body;
  
  const token = emailVerifyToken();

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
        html: `<p>인증링크를 클릭해주세요 : <a href="http://localhost:10000/verify?email=${email}&token=${token}">인증 링크</a></p>
        <p>해당 인증 링크는 24시간 이후 만료됩니다.</p>`
      };
  
      await transporter.sendMail(mailOptions);
      console.log('email succecfully sended');
    } catch (err) {
      console.error(err);
    }
  };
  
  sendMail(email);

  let sql = 'INSERT INTO users (role_id, email, password, username, nickname, phone_number, verification) VALUES (2, ?, ?, ?, ?, ?, ?)';

  //console.log(req.body)
  try {
    let result = await pool.query(sql, [
      email, 
      await bcrypt.hash(password, 10),
      username, 
      nickname, 
      phone_number, 
      token // verification 칼럼에 생성된 난수 token 넣음
    ]);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});

// verify API
router.get('/verify', async(req, res)=>{
  const { email, token } = req.query;
  
  let sql = 'SELECT * FROM users WHERE email = ?';

  try {
    // 쿼리스트링으로 들어온 email을 이용하여 사용자 찾기
    let result = await pool.query(sql, [email]);
    
    // 쿼리스트링으로 들어온 token과 해당 유저의 verification이 동일하다면 verification 칼럼 0으로 변경
    if(result[0].verification == token){
      let sql2 = 'UPDATE users SET verification=? WHERE id=?';
      await pool.query(sql2, [0, result[0].id]);

      res.send('인증이 완료되었습니다.');
    } else {
      res.send('인증 링크에 오류가 발생했습니다. 회원가입을 다시 진행해주세요.');
    }
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});

module.exports = router;