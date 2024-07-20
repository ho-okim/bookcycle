const mysql = require('mysql2');
const pool = require("../db.js");
const passport = require("passport"); // 로그인 
const local = require('./localStrategy.js'); // 지정한 localStrategy

module.exports = () => {
    passport.serializeUser( (user, done) => { // 로그인 시 실행, req.session에 데이터 저장
        process.nextTick(() => {
            done(null, { email : user.email, username : user.username });
        });
    });

    passport.deserializeUser( async (user, done) => { // 매 요청마다 실행, id로 사용자 정보 객체 불러옴
        // id로 사용자 정보 조회
        // user는 passport.serializeUser에서 저장된 user
        let sql = `SELECT * FROM users WHERE email = ?`;

        try {
            const query = mysql.format(sql, [user.email]);
            let [data] = await pool.query(query);    

            const userInfo = {
                id : data.id,
                email : data.email,
                nickname : data.nickname,
                profile_image : data.profile_image,
                phone_number : data.phone_number,
                username : data.username,
                manner_score : data.manner_score,
                verification : data.verification,
                blocked : data.blocked
            }

            process.nextTick(() => {
                return done(null, userInfo); // req.user에 user 저장
            });
        } catch (error) {
            return done(error);
        }
    });

    // local login strategy
    local();
}