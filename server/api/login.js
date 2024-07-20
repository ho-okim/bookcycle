require('dotenv').config();
const nodemailer = require('nodemailer');
const router = require('express').Router();
const passport = require("passport");
const mysql = require('mysql2');
const pool = require("../db.js");
const bcrypt = require("bcrypt");
const { isNotLoggedIn, isLoggedIn } = require('../lib/auth');
const {generateRandomString} = require('../lib/generateRandom.js');
const findpwdHtml = require('../html/findpwdHtml.js');

const CLIENT_PORT = process.env.CLIENT_PORT;
const SERVER_DOMAIN = process.env.SERVER_DOMAIN;
const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN;
const hostname = 'localhost';

// 로그인
router.post('/login', isNotLoggedIn, async (req, res, next) => {

  passport.authenticate("local", (error, user, info) => {
    // 인증 오류 처리
    if (error) return res.json({ message : '500 error' });
    // 로그인 실패 처리
    if (!user) return res.json({ message : info.message });
    // verification 검증
    if (user.verification === 0) {
      return res.json({ message : "not verified" });
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
router.get("/getLoginUser", (req, res)=>{
  try {
    res.send(req.user);
  } catch (error) {
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
          path: `https://${CLIENT_DOMAIN}/img/bookcycle-logo.png`,
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

  try { // 사용자 정보 조회 - 접근 차단용
    const user_query = mysql.format(user_sql, [decodedEmail]);
    const [userRes] = await pool.query(user_query);

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
      // 메일 전송
      sendMail(email);
      
       // 인증 정보 저장
      const verify_query = mysql.format(verify_sql, [ userRes.id, secured_key, date_expired ]);
      const result = await pool.query(verify_query);

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
    const query = mysql.format(sql, [decodedKey]);
    const [result] = await pool.query(query);
    let dateNow = new Date();

    if (!result) {
      res.status(400).redirect(CLIENT_DOMAIN ? 
        `https://${CLIENT_DOMAIN}/verify/notfound?v=1` :
        `http://localhost:${CLIENT_PORT}/verify/notfound?v=1`
      );
    } else if(dateNow <= new Date(result.date_expired)) {
      // 쿼리스트링으로 들어온 securedKey가 존재하고, 만료기한 내에 접근했다면 비밀번호 초기화 진행

      const encodedEmail = encodeURIComponent(result.email);

      // 인증 테이블의 데이터 제거
      let verifyRM_sql = 'DELETE FROM verification WHERE secured_key = ?';
      
      try {
        const query = mysql.format(verifyRM_sql, [decodedKey]);
        const verifyRM_result = await pool.query(query);

        if (verifyRM_result.affectedRows === 1) {
          res.redirect(CLIENT_DOMAIN ?
            `https://${CLIENT_DOMAIN}/password/reset/${encodedEmail}` :
            `http://localhost:${CLIENT_PORT}/password/reset/${encodedEmail}`
          );
        }
      } catch (error) {
        console.error(error);
        res.status(500).redirect(CLIENT_DOMAIN ?
          `https://${CLIENT_DOMAIN}/verify/error?v=1` :
          `http://localhost:${CLIENT_PORT}/verify/error?v=1`
        );
      }
    } else {
      res.status(401).redirect(CLIENT_DOMAIN ?
        `https://${CLIENT_DOMAIN}/verify/expired?v=1` :
        `http://localhost:${CLIENT_PORT}/verify/expired?v=1`
      );
    }
  } catch (error) {
    console.error(error);
    res.status(500).redirect(CLIENT_DOMAIN ?
      `https://${CLIENT_DOMAIN}/verify/error?v=1` :
      `http://localhost:${CLIENT_PORT}/verify/error?v=1`
    );
  }
});

// 비밀번호 초기화
router.post('/password/reset', isNotLoggedIn, async (req, res) => {
  const { email, password } = req.body;

  // 비밀번호 복호화 및 이메일 디코딩
  const newPassword = await bcrypt.hash(password, 10);
  const decodedEmail = decodeURIComponent(email);

  // 기존 비밀번호와 같은지 확인
  let check_sql = 'SELECT password FROM users WHERE email = ?';

  // 비밀번호 업데이트
  let sql = 'UPDATE users SET password = ? WHERE email = ?';

  try {
    // 기존 비밀번호 가져오기
    const check_query = mysql.format(check_sql, [decodedEmail]);
    const [check_result] = await pool.query(check_query);

    // 비밀번호 일치 여부
    const password_compare = await bcrypt.compare(password, check_result.password);

    if (password_compare) { // 같은 비번이라면 업데이트 취소
      res.status(200).send('same password');
    } else { // 다른 비번이라면 새로 업데이트
      const query = mysql.format(sql, [newPassword, decodedEmail]);
      const result = await pool.query(query);
  
      if (result.affectedRows == 0) {
        res.status(500).send('error');
      } else if (result.affectedRows == 1) {
        res.status(200).send('success');
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('error');
  }
})

module.exports = router;