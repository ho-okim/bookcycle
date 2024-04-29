const router = require('express').Router();
const passport = require("passport");

// 로그인
router.post('/login', async (req, res, next) => {

    passport.authenticate(("local"), (error, user, info) => {
        // 인증 오류 처리
        if (error) return res.json({ message : error });
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

// 서버 테스트용 - 로그인 페이지 이동
router.get("/login", (req, res) => {
    res.sendFile(__dirname + "/test.html");
});

// 로그아웃 - DB에 저장된 세션에도 자동 처리됨
router.get("/logout", (req, res) => {
    req.logOut(() => {
        console.log("로그아웃 완료됨");
        res.send("logged out");
    });
});

// 로그인 한 사용자 조회
router.get("/getLoginUser", (req, res)=>{
  if(req.user){
    res.send(req.user);
  }
});

module.exports = router;