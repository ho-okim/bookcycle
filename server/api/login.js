require('dotenv').config();
const nodemailer = require('nodemailer');
const router = require('express').Router();
const passport = require("passport");
const pool = require("../db.js");
const bcrypt = require("bcrypt");
const { isNotLoggedIn, isLoggedIn } = require('../lib/auth');
const {generateRandomString} = require('../lib/generateRandom.js');
const findpwdHtml = require('../html/findpwdHtml.js');

// 로그인
router.post('/login', isNotLoggedIn, async (req, res, next) => {

    passport.authenticate(("local"), (error, user, info) => {
        // 인증 오류 처리
        if (error) return res.json({ message : '500 error' });
        // 로그인 실패 처리
        if (!user) return res.json({ message : info.message });
        // verification 검증
        if (user.verification == 1){
          return res.json({ message : "expired" })
        } else if (user.verification != 0){
          return res.json({ message : "sent" })
        }
        // 에러 발생 시 next 미들웨어로 오류 처리 넘김
        if (error) return next(err);

        req.logIn(user, (err) => {
            // 에러 발생 시 next 미들웨어로 오류 처리 넘김
            if (err) return next(err);

            delete user.password;

            return res.json({user, message : "success" });
        });
    })(req, res, next);
});

// 로그아웃 - DB에 저장된 세션에도 자동 처리됨
router.get("/logout", isLoggedIn, (req, res) => {
    req.logOut(() => {
        // 세션 제거
        req.session.destroy((error) => {
          if (error) throw error;
        });
        // 쿠키 제거
        res.clearCookie('bookie', req.signedCookies['bookie'], {
          httpOnly : true,
          secure : false
        });
        res.send("logged out");
    });
});

// 로그인 한 사용자 조회
router.get("/getLoginUser", isLoggedIn, (req, res)=>{
  try {
    res.send(req.user);
  } catch (error) {
    console.error(error);
    res.send(null);
  }
});

// 비번찾기 - 이메일로 인증메일 발송
router.get("/password/sendEmail", isNotLoggedIn, async (req, res) => {
  const { email } = req.query;
  
  const decodedEmail = decodeURIComponent(email);

  // 인증키 생성
  const secured_key = await bcrypt.hash(generateRandomString(), 10);

  // 이메일 html
  const emailHtml = findpwdHtml(encodeURIComponent(secured_key));

  const sendMail =  async (decodedEmail) => {
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
        to: decodedEmail,
        subject: "[북사이클] 비밀번호 초기화 이메일입니다.",
        html: emailHtml,
        attachments: [{
          filename: 'bookcycle-logo.png',
          path: 'http://localhost:3000/img/bookcycle-logo.png',
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
      res.status(500).send('email send error');
    }
  };
  
  // 사용자 정보 쿼리
  let user_sql = 'SELECT id, verification, blocked FROM users WHERE email = ?';
// verification -> is_verified
  try { // 사용자 정보 조회 - 접근 차단용
    const [userRes] = await pool.query(user_sql, [decodedEmail]);

    if (!userRes || userRes.verification === 0) { // 없는 이메일, 인증 안된 이메일은 차단
      res.status(403).send('not allowed');
      return;
    }

    // 인증 정보 쿼리
    let verify_sql = 'INSERT INTO verification (user_id, secured_key, date_expired) VALUES (?, ?, ?)';

    // 만료일
    const date_expired = new Date();
    date_expired.setMinutes(date_expired.getMinutes() + 10); // 10분 후 링크 만료

    try {
      console.log('----------send mail-----------');
      // 메일 전송
      sendMail(email);
      
       // 인증 정보 저장
      const result = await pool.query(verify_sql, [ userRes.id, secured_key, date_expired ]);

      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('verification_error');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('error');
  }
});

// verify API
router.get('/password/verify/:securedKey', isNotLoggedIn, async(req, res)=>{
  const { securedKey } = req.params;

  const decodedKey = decodeURIComponent(securedKey);

  let sql = 'SELECT * FROM user_verification WHERE secured_key = ?';

  try {
    // 쿼리스트링으로 들어온 securedKey로 테이블에 조회
    const [result] = await pool.query(sql, [decodedKey]);
    let dateNow = new Date();

    // 쿼리스트링으로 들어온 securedKey가 존재하고, 만료기한 내에 접근했다면 비밀번호 초기화 진행
    if(result && dateNow <= new Date(result.date_expired)) {
      const hashedEmail = await bcrypt.hash(result.email, 10);
      const encodedEmail = encodeURIComponent(hashedEmail);

      res.redirect(`http://localhost:3000/password/reset/${encodedEmail}`);
    } else {
      res.status(401).send('<p>인증 메일이 만료되었습니다. 다시 시도해주세요.</p><p><a href="http://localhost:3000/login">북사이클 바로가기</a></p>');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('error');
  }
});

module.exports = router;