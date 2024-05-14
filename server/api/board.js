const router = require('express').Router();
const pool = require("../db.js"); // db connection pool
const { isLoggedIn } = require("../lib/auth.js");

// 상위 10개 게시글 조회
router.get('/board', async (req, res) => {

    const loginUser = req.user ? req.user : null
    
    // query문 설정
    let sql = "SELECT * FROM board_user ORDER BY createdAt DESC";

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

  // console.log("게시글 내용 추가: ", req.body)

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
  let sql = "SELECT * FROM board_user WHERE id = ?";

  try {
    // db connection pool을 가져오고, query문 수행
    let result = await pool.query(sql, [id]);
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
      let sql1 = "DELETE FROM board_image WHERE board_id = ?";
      let sql1_result = await pool.query(sql1, [id]);

      let sql2 = "DELETE FROM board_liked WHERE board_id = ?";
      let sql2_result = await pool.query(sql2, [id]);

      let sql3 = "DELETE FROM reply WHERE board_id = ?";
      let sql3_result = await pool.query(sql3, [id]);

      let sql4 = "DELETE FROM board WHERE id = ?";
      let sql4_result = await pool.query(sql4, [id]);

      console.log("Deleted image:", sql1_result);
      console.log("Deleted board_liked:", sql2_result);
      console.log("Deleted reply:", sql3_result);
      console.log("Deleted board:", sql4_result);

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

  try {
    let result = await pool.query(sql, [title, content, id]);

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


// 댓글 조회 (id = boardId)
router.get('/reply/:id', async(req, res) => {
  let { id } = req.params;

  let sql = "SELECT * FROM reply_user WHERE board_id = ? ORDER BY createdAt ASC";

  try {
    let result = await pool.query(sql, [id]);

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
    let sql_result = await pool.query(sql, [id]);

    res.send(sql_result);

  } catch(error){
    console.error(error);
    res.send('error');
  }
})


// 좋아요 개수 조회 (id = boardId)
router.get('/likeCount/:id', isLoggedIn, async(req, res)=>{
  let { id } = req.params;

  let sql = "SELECT likehit FROM board WHERE id = ?";

  try {
    let result = await pool.query(sql, [id]);
    res.send(result)
    // console.log(result)

  } catch(error) {
    console.error(error);
    res.send('error');
  }
})

// 좋아요 등록 - 🤍 unliked 상태일 때, 하트 누를 경우 -> 좋아요 등록
router.post('/hitLike/:id', isLoggedIn, async(req, res)=>{
  let { id } = req.params;

  let sql = 'INSERT INTO board_liked (user_id, board_id) VALUES (?, ?)';

  try {
    let result = await pool.query(sql, [req.user.id, id]);
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

  try{
    let result = await pool.query(sql, [req.user.id, id]);
    res.send(result);

  } catch(error){
    console.error(error);
    res.send('error');
  }
})


// 좋아요 조회 - liked 🤍 / unliked 💛 어떤 상태인지 조회한 다음 등록/삭제 가능
router.get('/likeState/:id', isLoggedIn, async(req, res)=>{
  let { id } = req.params;

  let sql = 'SELECT user_id, board_id FROM board_liked WHERE user_id = ?';

  try{
    let result = await pool.query(sql, [req.user.id]);
    res.send(result);

  } catch(error){
    console.error(error);
    res.send('error');
  }
})

// 게시글 사진 조회
router.get('/board/file/:id', isLoggedIn, async(req, res)=>{
  let { id } = req.params;

  let sql = "SELECT id, boardNo, filename FROM board_image WHERE board_id = ? ORDER BY boardNo";

  try {
    let result = await pool.query(sql, [id]);
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

// fs.readdir('./client/public/img/board', function(err, filesList) {
//   if (err) {
//     console.error('Error reading directory:', err);
//     return;
//   }
//   console.log("list:", filesList);
// });

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
  const lastIdx = prevArray[prevArray.length - 1]?.boardNo
  // console.log("prevArray ", prevArray)
  // console.log("delArray: ", delArray)

  try {
    if(prevArray.length == 0){ // prevArray.length가 0이면 기존 파일이 모두 지워졌다는 뜻
      // 해당 게시글의 사진 전부 지우기
      await pool.query(sql3, [editBoardId])

      // 실제 파일들 지우기
      delArray.forEach((el)=>{
        fs.unlink(`./client/public/img/board/${el.filename}`, (err)=>{})
      })


      // 새로운 파일 DB에 저장
      files.forEach(async (el, i)=>{
        result = await pool.query(sql, [editBoardId, i, el.filename]); 
      })
    } else { // 기존 파일이 남아있을 때 진입
      // 해당 게시글의 파일 DB 지우기
      delArray.forEach(async (el, i)=>{
        // console.log("삭제하는 사진의 id: ", el.id)
        const result = await pool.query(sql2, [el.id])
      })
      
      // 기존 파일 boardNo 업데이트
      prevArray.forEach(async (el, i)=>{
        // console.log(el.id, "의 boardNo를 ", i, "로 변경")
        await pool.query(sql4, [i, el.id]);
      })

      // 실제 파일들 지우기
      delArray.forEach((el)=>{
        fs.unlink(`./client/public/img/board/${el.filename}`, (err)=>{})
      })
      
      // 새로운 파일 DB에 저장
      files.forEach(async (el, i)=>{
        result = await pool.query(sql, [editBoardId, i + prevArray.length, el.filename]); 
      })
    }
  
    res.send(result);
  } catch (error) {
    console.log('fileupload UPDATE 과정에서 오류 발생 : ', error)
  }
})

module.exports = router;
