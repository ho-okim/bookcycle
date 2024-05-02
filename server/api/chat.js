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
      let sql2 = `SELECT c.id, c.updatedAt, COALESCE(COUNT(m.read_or_not), 0) AS read_count
      FROM chatroom AS c 
      LEFT JOIN chat_message AS m ON c.id = m.room_id AND m.read_or_not = 1 AND m.user_id != ?
      WHERE c.id IN ((SELECT chatroom_id FROM chatroom_list WHERE user_id = ?))
      GROUP BY c.id;`
  
    // db connection pool을 가져오고, query문 수행
    let result = await pool.query(sql, [loginUser.id, loginUser.id]);
    let readOrNot = await pool.query(sql2, [loginUser.id, loginUser.id])
  
    res.send({result, readOrNot});
  } else {
    res.send({message : 'need login'}) 
  }
});

router.get('/newChatroom', async (req, res) => {
  const loginUser = req.user ? req.user : null

  if(loginUser){
    let sql = 'INSERT INTO chatroom (latest_msg) VALUES (?)';
  
    let result = await pool.query(sql, [null]);
  
    // result.insertId 로 새로 생성된 row의 id 가져올 수 있음
    res.send(result);
  } else {
    res.send({message : 'need login'})
  }
});

// 채팅방에 속한 메세지와 product 정보 가져오는 API
router.get('/getChatMsg/:roomId', async (req, res) => {
  const loginUser = req.user ? req.user : null
  const {roomId} = req.params

  if(loginUser){
    let sql = 'SELECT * FROM chat_message WHERE room_id = ?';
    let sql2 = 'SELECT * FROM chatroom_product WHERE chatroom_id = ?';
  
    let result = await pool.query(sql, [roomId]);
    let product = await pool.query(sql2, [roomId]);
  
    res.send({result, product});
  } else {
    res.send({message : 'need login'})
  }
});

router.put('/', (req, res) => {

});

router.delete('/', (req, res) => {

});

module.exports = router;