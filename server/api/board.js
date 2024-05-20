const router = require('express').Router();
const pool = require("../db.js"); // db connection pool
const mysql = require('mysql2');
const { CHAR_REG } = require('../lib/regex_server.js');
const { isLoggedIn } = require("../lib/auth.js");

// 상위 10개 게시글 조회
router.get('/board', async (req, res) => {
  const { sortBy, updown } = req.query; // 초기 query 없음 -> 아래와 같이 초기 값 설정 됨 {'createdAt' : 'DESC'}

  // 초기 sortBy(likehit/createdAt) & updown(ASC/DESC)
  let newSortBy = CHAR_REG.test(sortBy) ? sortBy.trim() : 'createdAt';
  
  // query문 설정
  let sql = "SELECT * FROM board_user ";

  let order_sql = `ORDER BY ${newSortBy} ${updown}`;

  try {
    // db connection pool을 가져오고, query문 수행
    let result = await pool.query(sql+order_sql);
    res.send(result);

  } catch (error) {
    console.error(error);
    res.send('error');
  }
});


// 게시글 작성(추가)
router.post('/boardwrite', isLoggedIn, async(req, res) => {

  // client에서 보낸 request body
  const {title, content} = req.body;

  let sql = 'INSERT INTO board (user_id, title, content) VALUES (?, ?, ?)';
  const query = mysql.format(sql, [req.user.id, title, content]);

  // console.log("게시글 내용 추가: ", req.body)

  try {
    let result = await pool.query(query); 
  
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});


// 특정 글 조회
router.get('/board/:id', async (req, res) => {
  let { id } = req.params;
  // query문 설정
  let sql = "SELECT * FROM board_user WHERE id = ?";
  const query = mysql.format(sql, [id]);

  let count_sql = 'UPDATE board SET view_count = view_count + 1 WHERE id =? '
  const result_query = mysql.format(count_sql, [id]);
  
  try {
    // db connection pool을 가져오고, query문 수행
    let result = await pool.query(query); // 글 가져오기
    await pool.query(result_query); // 조회수 업데이트

    res.send(result);
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});


// 게시글 삭제
router.post('/delete/:id', isLoggedIn, async (req, res) => {
  let { id } = req.params;

  // board - board_image/board_liked/reply 제약조건 관계로
  // 3개 테이블의 열 먼저 삭제 후 -> board 열 삭제 가능
  try {
      let sql = "DELETE FROM board WHERE id = ?";
      const query = mysql.format(sql, [id]);
      let result = await pool.query(query);

      console.log("Deleted board:", result);
      res.status(200).json({ message: "Board, related images and liked deleted successfully", deletedId: id });
  } catch (error) {
      console.error(error);

      res.status(500).json({ error: "An error occurred while processing the request" });
  }
});


// 게시글 수정
router.post('/edit/:id', isLoggedIn, async(req, res) => {
  let { id } = req.params;

  let title = req.body.title;
  let content = req.body.content;

  let sql = "UPDATE board SET title = ?, content = ? WHERE id = ?";
  const query = mysql.format(sql, [title, content, id]);

  try {
    let result = await pool.query(query);

    // console.log("게시글 수정 결과: ", result)
  
    res.send(result);

  } catch (error) {
    console.error(error);
    res.send('error');
  }
});


// 댓글 작성 
router.post('/replyWrite/:id', isLoggedIn, async(req, res)=>{
  const { reply } = req.body;
  let { id } = req.params;

  let sql = 'INSERT INTO reply (board_id, user_id, content) VALUES (?, ?, ?)';
  const query = mysql.format(sql, [id, req.user.id, reply]);

  try {
    let result = await pool.query(query); 
    res.send(result);

  } catch (error) {
    console.error(error);
    res.send('error');
  }
});


// 댓글 조회 (id = boardId)
router.get('/reply/:id', async(req, res) => {
  let { id } = req.params;

  let sql = "SELECT * FROM reply_user WHERE board_id = ? ORDER BY createdAt ASC";
  const query = mysql.format(sql, [id]);

  try {
    let result = await pool.query(query);

    // console.log("댓글 조회: ", result);
  
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});


// 댓글 삭제 (id = 삭제되는 댓글 id)
router.post('/replyDelete/:id', async(req, res)=>{
  let { id } = req.params;

  console.log("삭제되는 댓글 id: ", id)

  try {
    let sql = "DELETE FROM reply WHERE id = ?";
    const query = mysql.format(sql, [id]);
    let sql_result = await pool.query(query);

    res.send(sql_result);

  } catch(error){
    console.error(error);
    res.send('error');
  }
})

// 좋아요 등록 - 🤍 unliked 상태일 때, 하트 누를 경우 -> 좋아요 등록
router.post('/hitLike/:id', isLoggedIn, async(req, res)=>{
  let { id } = req.params;

  let sql = 'INSERT INTO board_liked (user_id, board_id) VALUES (?, ?)';
  const query = mysql.format(sql, [req.user.id, id]);

  try {
    let result = await pool.query(query);
    res.send(result);

  } catch (error){
    console.error(error);
    res.send('error')
  }
})

// 좋아요 삭제(취소) - 💛 liked 상태일 때, 하트 누를 경우 -> 좋아요 삭제
router.post('/unLike/:id', isLoggedIn, async(req, res)=>{
  let { id } = req.params;

  let sql = 'DELETE FROM board_liked WHERE user_id = ? AND board_id = ?';
  const query = mysql.format(sql, [req.user.id, id]);

  try{
    let result = await pool.query(query);
    res.send(result);

  } catch(error){
    console.error(error);
    res.send('error');
  }
})


// 좋아요 조회 - liked 🤍 / unliked 💛 어떤 상태인지 조회한 다음 등록/삭제 가능
router.get('/likeState/:id', async(req, res)=>{
  let { id } = req.params;

  try{
      if (!req.user) {
        let sql = 'SELECT user_id, board_id FROM board_liked';
        let result = await pool.query(sql);

        res.send(result);
      } 
      if (req.user) {
        let sql2 = 'SELECT user_id, board_id FROM board_liked WHERE user_id = ?';
        let result2 = await pool.query(sql2, [req.user.id]);

        res.send(result2);
      }
    } catch(error){
      console.error(error);
      res.send('error');
    }
})

// 게시글 사진 조회
router.get('/board/file/:id', async(req, res)=>{
  let { id } = req.params;

  let sql = "SELECT id, boardNo, filename FROM board_image WHERE board_id = ? ORDER BY boardNo";
  const query = mysql.format(sql, [id]);

  try {
    let result = await pool.query(query);
    res.send(result)

  } catch(error) {
    console.error(error);
    res.send('error');
  }
})


// 사진 업로드 위한 패키지 require
const path = require('path')
const multer = require('multer')
const uuid4 = require('uuid4')
// 파일 시스템 함수 require
const fs = require('fs')

// 미들웨어 설정
const upload = multer({
  storage: multer.diskStorage({
    filename(req, file, done) {
      const randomID = uuid4();
      const ext = path.extname(file.originalname);
      const filename = randomID + ext;
      done(null, filename);
    },
    destination(req, file, done) {
      done(null, path.join(__dirname, "../../client/public/img/board"));
    },
  }),
  limits: { fileSize: 1024 * 1024 },
});

// 파일 업로드
router.post('/fileupload', isLoggedIn, upload.array('files', 5), async(req, res)=>{
  let sql = 'INSERT INTO board_image (board_id, boardNo, filename) VALUES (?, ?, ?)';
  const files = req.files
  let result

  try {
    files.forEach(async (el, i)=>{
      const query = mysql.format(sql, [req.body.boardId, i, el.filename]);
      result = await pool.query(query); 
    })
  
    res.send(result);
  } catch (error) {
    console.log('fileupload POST 과정에서 오류 발생 : ', error)
  }
})

// 파일 수정
router.post('/fileupdate', isLoggedIn, upload.array('files', 5), async(req, res)=>{
  let sql = 'INSERT INTO board_image (board_id, boardNo, filename) VALUES (?, ?, ?)';
  let sql2 = 'DELETE FROM board_image WHERE id = ?'
  let sql3 = 'DELETE FROM board_image WHERE board_id = ?'
  let sql4 = "UPDATE board_image SET boardNo = ? WHERE id = ?";
  let result
  const files = req.files
  const {editBoardId, prevFiles, delFiles} = req.body
  // 기존 파일들 데이터 받아옴
  const prevArray = JSON.parse(prevFiles)
  const delArray = JSON.parse(delFiles)
  // console.log("prevArray ", prevArray)
  // console.log("delArray: ", delArray)
  const query = mysql.format(sql3, [editBoardId]);

  try {
    if(prevArray.length == 0){ // prevArray.length가 0이면 기존 파일이 모두 지워졌다는 뜻
      // 해당 게시글의 사진 전부 지우기
      await pool.query(query)

      // 실제 파일들 지우기
      delArray.forEach((el)=>{
        fs.unlink(`./client/public/img/board/${el.filename}`, (err)=>{})
      })


      // 새로운 파일 DB에 저장
      files.forEach(async (el, i)=>{
        const query2 = mysql.format(sql, [editBoardId, i, el.filename]);
        result = await pool.query(query2); 
      })
    } else { // 기존 파일이 남아있을 때 진입
      // 해당 게시글의 파일 DB 지우기
      delArray.forEach(async (el, i)=>{
        // console.log("삭제하는 사진의 id: ", el.id)
        const query3 = mysql.format(sql2, [el.id]);
        const result = await pool.query(query3)
      })
      
      // 기존 파일 boardNo 업데이트
      prevArray.forEach(async (el, i)=>{
        // console.log(el.id, "의 boardNo를 ", i, "로 변경")
        const query4 = mysql.format(sql4, [i, el.id]);
        await pool.query(query4);
      })

      // 실제 파일들 지우기
      delArray.forEach((el)=>{
        fs.unlink(`./client/public/img/board/${el.filename}`, (err)=>{})
      })
      
      // 새로운 파일 DB에 저장
      files.forEach(async (el, i)=>{
        const query5 = mysql.format(sql, [editBoardId, i + prevArray.length, el.filename]);
        result = await pool.query(query5); 
      })
    }
  
    res.send(result);
  } catch (error) {
    console.log('fileupload UPDATE 과정에서 오류 발생 : ', error)
  }
})

module.exports = router;
