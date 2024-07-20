const mysql = require('mysql2');
const pool = require("../db.js");
const passport = require("passport"); // 로그인 
const LocalStrategy = require("passport-local"); // 로그인방법
const bcrypt = require("bcrypt"); // 암호화

module.exports = () => {
    passport.use(new LocalStrategy({  // 로그인 방법
        usernameField : "email", // 사용자이메일, 비번
        passwordField : "password"
    }, async (email, password, done) => { // 로그인 처리
        try {
            // db에서 email 조회
            let sql = 'SELECT id, email, password, username, nickname, verification FROM users WHERE email = ?';
            const query = mysql.format(sql, [email]);
            let [data] = await pool.query(query);

            // 아이디 없음 처리
            if (!data || data.length === 0) {
                // 둘 중 뭐가 틀렸는지 모르게 처리
                return done(null, false, { message : "login fail" });
            }

            // 비밀번호 비교 처리
            const res = await bcrypt.compare(password, data.password);

            if (res) {
                return done(null, data);
            } else {
                // 둘 중 뭐가 틀렸는지 모르게 처리
                return done(null, false, { message : "login fail" });
            }
            } catch (error) {
            return done(error);
            }
        }
    ));
}
