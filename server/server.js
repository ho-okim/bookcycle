// 서버 세팅 -----------------------------------------------
// 환경변수
require("dotenv").config();

const PORT = process.env.PORT || 10000;

// express 설정
const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const whiteList = [`http://localhost:${PORT}`, `http://localhost:3000`]

// http와 socket.io 설정
const { createServer } = require("http");
const { Server } = require("socket.io");
const exp = require("constants");
const server = createServer(app); // express를 사용한 http 서버 생성
const io = new Server(server, {
  cors: {
    origin: whiteList
  }
}); // socket 서버 생성

// session 및 로그인 설정
const session = require("express-session"); // session
const passport = require("passport"); // 로그인 
const LocalStrategy = require("passport-local"); // 로그인방법
const bcrypt = require("bcrypt"); // 암호화
const MySQLStore = require("express-mysql-session")(session);

// db
const dbConfig = require("../db_config.json");
const pool = require("./db.js");

// session 설정
const sessionOption = {
    secret : process.env.COOKIE_SECRET, // secret 키
    resave : false,
    saveUninitialized : false,
    cookie : {
        maxAge : 60 * 60 * 1000, // 1시간
        httpOnly : true,
        secure : false
    }, 
    name : 'bookie',
    store : new MySQLStore( dbConfig )
}

// public 폴더 경로 설정
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

// app 설정 : body-parser
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

// app 설정 : cookie-parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// app 설정 : cors
app.use(cors({
    origin: whiteList,
    credentials: true, // 쿠키 접근 허용
    optionsSuccessStatus: 200
}));

// passport 설정------------------------------------------------------------
app.use(passport.initialize()); // 초기화, 사용자 인증 처리
app.use(session(sessionOption)); // session 옵션 사용
app.use(passport.session()); // 세션을 사용하도록 설정

passport.use(new LocalStrategy( // 로그인 방법
    {usernameField : "email", passwordField : "password"}, // 사용자이메일, 비번
    async (email, password, done) => { // 로그인 처리
        try {
            // db에서 email 조회
            let sql = `SELECT * FROM users WHERE email = ?`;
            let [data] = await pool.query(sql, [email])

            // 아이디 없음 처리
            if (!data || data.length === 0) {
                console.log('아이디없음');
                return done(null, false, { message : "id fail" });
            }

            // 비밀번호 비교 처리
            const res = await bcrypt.compare(password, data.password)

            if (res) {
                return done(null, data);
            } else {
                console.log('비번불일치');
                return done(null, false, { message : "password fail" });
            }
        } catch (error) {
            console.log(error);
            return done(error);
        }
    }
));

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
        let [data] = await pool.query(sql, [user.email]);
    
        delete data.password;

        process.nextTick(() => {
            return done(null, data); // req.user에 user 저장
        });
    } catch (error) {
        console.log(error);
        return done(error);
    }

});

// DB 연결 시 서버 열림-------------------------------------------
if (pool) {
    server.listen(PORT, () => {
        console.log(`server on : http://localhost:${PORT}/`);
    });
}

// router --------------------------------------------------------
app.use("/", require('./api/main.js'));
app.use("/", require('./api/login.js'));
app.use("/", require('./api/join.js'));
app.use("/", require('./api/mypage.js'));
app.use("/", require('./api/user.js'));
app.use("/", require('./api/board.js'));
app.use("/", require('./api/report.js'));
app.use("/", require('./api/chat.js'));


// 소켓 통신
io.on('connection', (socket)=>{
  console.log('websocket connected')

  socket.on('join', async (data)=>{
    socket.join(data)
  })

  socket.on('send-message', async (data) => {
    console.log(data.socketMsg)
    // db에 메세지 저장
  })

  
})