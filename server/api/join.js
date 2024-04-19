require('dotenv').config()
const nodemailer = require('nodemailer')

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

  async function register(email){
    try {
      // ... 회원가입 관련 로직들
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: true,
        auth: {
          type: "OAuth2",
          user: process.env.GMAIL_OAUTH_USER,
          clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
          clientSecret: process.env.GAMIL_OAUTH_CLIENT_SECRET,
          refreshToken: process.env.GAMIL_OAUTH_REFRESH_TOKEN,
        },
      });
  
      const mailOptions = {
        to: email,
        subject: "[북사이클] 회원가입 인증 메일입니다.",
        html: `인증링크를 클릭해주세요 : <a href="http://localhost:10000/verify?token=${emailVerifyToken}"></a>`,
      };
  
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error(err)
    }
  };

  register(email)

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