const router = require('express').Router();
const pool = require("../db.js"); // db connection pool

router.get('/chatlist', async (req, res) => {
  const loginUser = req.user ? req.user : null

  if(loginUser){
    // query문 설정
    let sql = 
    `SELECT * FROM chatroom_list 
      WHERE chatroom_id 
      IN ((SELECT chatroom_id FROM chatroom_list WHERE user_id = ?))
      AND user_id != ?`;

      // 읽지 않은 메세지 개수를 가져오기 위한 쿼리문
      let sql2 = `SELECT *, COUNT(*) FROM bookcycle_database.chat_message 
      WHERE user_id != 1 GROUP BY room_id, read_or_not`
  
    // db connection pool을 가져오고, query문 수행
    let result = await pool.query(sql, [loginUser.id, loginUser.id]);
  
    res.send(result);
  } else {
    res.send({message : 'need login'})
  }
});

router.get('/newChatroom', async (req, res) => {
  const loginUser = req.user ? req.user : null
  console.log(loginUser)

  if(loginUser){
    let sql = 'INSERT INTO chatroom (latest_msg) VALUES (?)';
  
    let result = await pool.query(sql, [null]);
  
    // result.insertId 로 새로 생성된 row의 id 가져올 수 있음
    res.send(result);
  } else {
    res.send({message : 'need login'})
  }
});

router.post('/', (req, res) => {

});

router.put('/', (req, res) => {

});

router.delete('/', (req, res) => {

});

module.exports = router;