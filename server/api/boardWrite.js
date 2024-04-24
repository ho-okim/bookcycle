const router = require('express').Router();
const pool = require("../db.js"); // db connection pool

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

router.post('/boardwrite', async(req, res) => {
  // client에서 보낸 request body
  const {title, content} = req.body;

  let sql = 'INSERT INTO board (user_id, title, content) VALUES (1, ?, ?)';

  console.log(req.body)

  let result = await pool.query(sql, [
    title,
    content
  ]); 

  res.send(result);
});

router.post('/fileupload', upload.array('files', 5), async(req, res)=>{
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

router.put('/', (req, res) => {

});

router.delete('/', (req, res) => {

});

module.exports = router;
