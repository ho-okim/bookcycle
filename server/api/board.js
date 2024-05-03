const router = require('express').Router();
const pool = require("../db.js"); // db connection pool
const { isLoggedIn } = require("../lib/auth.js");

// 상위 10개 게시글 조회
router.get('/board', async (req, res) => {

  const loginUser = req.user ? req.user : null
  
  // query문 설정
  let sql = "SELECT * FROM board ORDER BY createdAt DESC LIMIT 10";

  try {
    // db connection pool을 가져오고, query문 수행
    let result = await pool.query(sql);
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

  console.log("게시글 내용 추가: ", req.body)

  try {
    let result = await pool.query(sql, [
      req.user.id,
      title,
      content
    ]); 
  
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
  let sql = "SELECT * FROM board WHERE id = ?";

  try {
    // db connection pool을 가져오고, query문 수행
    let result = await pool.query(sql, [id]);

    console.log("특정 사용자글 조회: ", result)

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
  // board_image/board_liked/reply 열 먼저 삭제 후 -> board 열 삭제
  try {
      let sql1 = "DELETE FROM board_image WHERE board_id = ?";
      let sql1_result = await pool.query(sql1, [id]);

      let sql2 = "DELETE FROM board_liked WHERE board_id = ?";
      let sql2_result = await pool.query(sql2, [id]);

      let sql3 = "DELETE FROM reply WHERE board_id = ?";
      let sql3_result = await pool.query(sql3, [id]);

      let sql4 = "DELETE FROM board WHERE id = ?";
      let sql4_result = await pool.query(sql4, [id]);

      console.log("Deleted image:", sql1_result);
      console.log("Deleted board:", sql2_result);
      console.log("Deleted board:", sql3_result);
      console.log("Deleted board:", sql4_result);

      res.status(200).json({ message: "Board, related images and liked deleted successfully", deletedId: id });
  } catch (error) {
      console.error("Error occurred during deletion:", error);

      res.status(500).json({ error: "An error occurred while processing the request" });
  }
});


// 게시글 수정
router.post('/edit/:id', isLoggedIn, async(req, res) => {
  let { id } = req.params;

  let title = req.body.title;
  let content = req.body.content;

  let sql = "UPDATE board SET title = ?, content = ? WHERE id = ?";

  try {
    let result = await pool.query(sql, [title, content, id]);

    console.log("게시글 수정 결과: ", result)
  
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

  console.log("댓글 등록 내용: ", req.body)

  let sql = 'INSERT INTO reply (board_id, user_id, content) VALUES (?, ?, ?)';

  try {
    let result = await pool.query(sql, [id, req.user.id, reply]); 

    res.send(result);
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});


// 댓글 조회
router.get('/reply/:id', async(req, res) => {
  let { id } = req.params;

  let sql = "SELECT * FROM reply WHERE board_id = ? ORDER BY createdAt DESC";;

  try {
    let result = await pool.query(sql, [id]);

    console.log("댓글 조회: ", result);
  
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});



// 사진 업로드 위한 패키지 require
const path = require('path')
const multer = require('multer')
const uuid4 = require('uuid4')
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
      done(null, path.join(__dirname, "../../client/public/img"));
    },
  }),
  limits: { fileSize: 1024 * 1024 },
});


router.post('/fileupload', isLoggedIn, upload.array('files', 5), async(req, res)=>{
  let sql = 'INSERT INTO board_image (board_id, boardNo, filename) VALUES (?, ?, ?)';
  const files = req.files
  let result

  try {
    files.forEach(async (el, i)=>{
      result = await pool.query(sql, [
        req.body.boardId,
        i,
        el.filename
      ]); 
    })
  
    res.send(result);
  } catch (error) {
    console.log('fileupload POST 과정에서 오류 발생 : ', error)
  }
})

module.exports = router;
