require('dotenv').config();
const nodemailer = require('nodemailer');
const router = require('express').Router();
const passport = require("passport");
const pool = require("../db.js");
const bcrypt = require("bcrypt");
const { isNotLoggedIn, isLoggedIn } = require('../lib/auth');
const { PASSWORD_REG } = require('../lib/regex_server');
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

// 랜덤 비밀번호 생성
function generateRandomPassword() {
  const pallet = '9876543210abcdeABCDEfghijpqrstuvwSTUVWXxyzFGHIJKklmnoLMNOPQRYZ!@#$%^&()_~[]';
  const pwdLength = 13;

  let result = '';

  while (!PASSWORD_REG.test(result)) {
      result = '';
      for (let i = 0; i < pwdLength; i++) {
          result += pallet.charAt(Math.random()*(pallet.length-1));
      }
  }
  console.log(`final result : ${result}`);
  return result;
}

// 비번찾기 - 이메일로 임시 비번 발급
router.get("/sendEmail", isNotLoggedIn, async (req, res) => {
  const { email } = req.query;

  // 임시 비밀번호 생성
  const tempPassword = generateRandomPassword();

  // 이메일 html
  const emailHtml = findpwdHtml(tempPassword);

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
        subject: "[북사이클] 임시 비밀번호 발급 이메일입니다.",
        html: emailHtml,
        attachments: [{
          filename: 'bookcycle-logo.png',
          path: 'http://localhost:3000/img/bookcycle-logo.png',
          cid: 'provide@bookcycle-logo.png'
        }]
      };
  
      await transporter.sendMail(mailOptions);
      console.log('email succecfully sended');
    } catch (err) {
      console.error(err);
    }
  };
  
  sendMail(email);
// 발송 오류시 처리 - 비번 교체 차단
  /*let sql = 'UPDATE users SET password = ? WHERE email = ?';

  try {
    let result = await pool.query(sql, [
      await bcrypt.hash(tempPassword, 10), email
    ]);
    res.send('ok');
  } catch (error) {
    console.error(error);
    res.status(500).send('error');
  }*/
});

module.exports = router;