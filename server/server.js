// 서버 세팅 -----------------------------------------------
// 환경변수
require("dotenv").config();

const PORT = process.env.PORT;
const CLIENT_PORT = process.env.CLIENT_PORT;
const HOSTNAME = process.env.HOSTNAME;
const SERVER_DOMAIN = process.env.SERVER_DOMAIN;
const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN;

// express 설정
const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const whiteList = SERVER_DOMAIN ? [ 
	`http://${HOSTNAME}:${PORT}`, `https://${HOSTNAME}:${PORT}`,
	`http://${HOSTNAME}:${CLIENT_PORT}`, `https://${HOSTNAME}:${CLIENT_PORT}`,
	`https://${SERVER_DOMAIN}`, `${SERVER_DOMAIN}`,
	`https://${CLIENT_DOMAIN}`, `http://${CLIENT_DOMAIN}:${CLIENT_PORT}`
] : [`http://${HOSTNAME}:${PORT}`, `http://${HOSTNAME}:${CLIENT_PORT}`];

// http와 socket.io 설정
const { createServer } = require("http");
const { Server } = require("socket.io");
const exp = require("constants");
const server = createServer(app); // express를 사용한 http 서버 생성
const io = new Server(server, {
  cors: {
    origin: whiteList,
    credentials: true
  }
}); // socket 서버 생성

// session 설정
const session = require("express-session"); // session
const MySQLStore = require("express-mysql-session")(session);

// db
const dbConfig = require("../db_config.json");
const mysql = require('mysql2');
const pool = require("./db.js");

// cookie 설정
const cookieOption = {
    maxAge : 60 * 60 * 10000, // 1시간
    httpOnly : true,
    secure : SERVER_DOMAIN ? true : false,
    sameSite: SERVER_DOMAIN ? 'None' : 'Lax',
    //domain: `https://${CLIENT_DOMAIN}`
}

// session 설정
const sessionOption = {
  secret : process.env.COOKIE_SECRET, // secret 키
  resave : false,
  saveUninitialized : false,
  cookie : cookieOption, 
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

// 배포용 설정---------------------------------------------------
// helmet : HTTP response header 설정으로 express를 보완하는 middleware
// hpp : HTTP parameter pollution 공격을 방지
const helmet = require('helmet');
const hpp = require('hpp');

if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
  app.use(hpp());
}

// sanitize-html : XSS 공격을 막기 위한 패키지
// sanitize.js에서 middleware를 가져옴
const {sanitizeMiddleware} = require('./lib/sanitize.js');
const reqSanitizer = require('req-sanitizer');

// req-sanitizer 사용 : req.body sanitize
app.use(reqSanitizer());

// winston - logger : log 저장용
const logger = require('./lib/logger.js');
app.use((req, res, next)=>{
  // 로그 메시지 생성
  const logMessage = `Request : ${req.method} ${req.url}`;

  // 요청을 로깅
  logger.log({
    level: 'info',
    message: logMessage
  });

  // 에러가 있으면 에러 로깅
  if (req.error) {
    logger.error({
      level: 'error',
      message: req.error.message
    });
  }

  next();
});

const passport = require("passport"); // 로그인 
const passportConfig = require('./passport'); // passport 설정
passportConfig();

app.use(session(sessionOption)); // session 옵션 사용
// passport 설정------------------------------------------------------------
app.use(passport.initialize()); // 초기화, 사용자 인증 처리
app.use(passport.session()); // 세션을 사용하도록 설정

// 배포용 설정---------------------------------------------------
// form 데이터 파싱
const bodyParser = require('body-parser');
const parseForm = bodyParser.urlencoded({extended: false});

// csurf : CSRF 공격을 막기 위한 패키지
const csrf = require('csurf');
const csrfProtection = csrf({ 
    cookie: {
      httpOnly : true,
      secure : true,
      sameSite: 'None',
    }
});

// GET 요청에서 태그와 attribute 제거 소독 진행
app.get('*', sanitizeMiddleware, (req, res, next) => {
  next();
});

// csrf 토큰 발행
app.get('/api/csrf', csrfProtection, (req, res) => { // token 발행 요청
  res.json({ csrfToken: req.csrfToken() });
});

// POST, PUT, DELETE 요청에 대해 csrfToken 검증
app.post('*', parseForm, csrfProtection, sanitizeMiddleware, (req, res, next) => { 
  next();
});
app.put('*', parseForm, csrfProtection, sanitizeMiddleware, (req, res, next) => {
  next();
});
app.delete('*', parseForm, csrfProtection, sanitizeMiddleware, (req, res, next) => {
  next();
});

// DB 연결 시 서버 열림-------------------------------------------
if (pool) {
  server.listen(PORT, HOSTNAME, () => {
    console.log(`server on : http://${HOSTNAME}:${PORT}/`);
  });
}

// router --------------------------------------------------------
app.use("/api", require('./api/main.js'));
app.use("/api", require('./api/login.js'));
app.use("/api", require('./api/join.js'));
app.use("/api", require('./api/mypage.js'));
app.use("/api", require('./api/product.js'));
app.use("/api", require('./api/user.js'));
app.use("/api", require('./api/board.js'));
app.use("/api", require('./api/report.js'));
app.use("/api", require('./api/chat.js'));
app.use("/api", require('./api/search.js'));
app.use("/api", require('./api/alert.js'));

const sessionMiddleware = session(sessionOption)

// socket.io에 세션 미들웨어를 연결함으로써 req에 담겨있는 session 값들을 사용할 수 있게 된다
io.use((socket, next)=>{
  sessionMiddleware(socket.request, {}, next)
})

// 소켓 통신
io.on('connection', (socket)=>{
  // console.log('websocket connected')

  socket.on('join', async (data)=>{
    console.log("websocket join : ", data)
    socket.join(data)
  })

  socket.on('send-message', async (data) => {
    // db에 메세지 저장
    const {loginUserId, socketMsg, chatroomIdx} = data
    const date = new Date()

    let sql = `INSERT INTO chat_message (user_id, room_id, message, createdAt) VALUES (?, ?, ?, ?)`;

    if(socketMsg){
      try {
        // let result = await pool.query(sql, [loginUserId, chatroomIdx, socketMsg, date]);
        const query = mysql.format(sql, [loginUserId, chatroomIdx, socketMsg, date]);
        let result = await pool.query(query);
        io.to(chatroomIdx).emit('success', {id : result.insertId, user_id : loginUserId, room_id: chatroomIdx, message: socketMsg, date})
      } catch (error) {
        console.error(error, 'chat message INSERT error');
      }
    }
  })

  socket.on('refreshRON', async (data) => {
    const {loginUserId, chatroomIdx} = data

    let sql = `UPDATE chat_message SET read_or_not = 0 WHERE user_id != ? AND room_id = ? AND read_or_not = 1;`
    
    try {
      // let result = await pool.query(sql, [loginUserId, chatroomIdx]);
      const query = mysql.format(sql, [loginUserId, chatroomIdx]);
      let result = await pool.query(query);
      io.to(chatroomIdx).emit('refreshSuccess', {loginUserId, room_id : chatroomIdx})
    } catch (error) {
      console.error(error, 'read or not UPDATE error');
    }
  })

  socket.on('sameChatroomIdx', async (data)=>{
    const {room_id} = data;
    // 서로 같은 채팅방에 있을 때는 모든 메시지가 읽음 처리되어야 하므로 room_id로만 update 기준 삼음
    let sql = 'UPDATE chat_message SET read_or_not = 0 WHERE room_id = ? AND read_or_not = 1;'
    const query = mysql.format(sql, [room_id]);

    try {
      let result = await pool.query(query);
      io.to(room_id).emit('msgCnt0', {chatroomIdx: room_id})
    } catch (error) {
      console.error(error, 'read or not UPDATE error');
    }
  })

  socket.on('difChatroomIdx', (data)=>{
    // 서로 다른 채팅방일 때는 데이터베이스에서는 다른 처리가 필요하지 않음
    io.to(data.room_id).emit('msgCnt1', {chatroomIdx: data.room_id})
  })
  
})
