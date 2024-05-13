const router = require('express').Router();
const pool = require("../db.js"); // db connection pool
const { isLoggedIn } = require("../lib/auth.js");

router.get('/chatlist', isLoggedIn, async (req, res) => {

  // 로그인 한 유저가 갖고 있는 채팅방 목록 가져오기 위한 쿼리문
  let sql = `SELECT * FROM chatroom_list 
    WHERE room_id 
    IN ((SELECT room_id FROM chatroom_list WHERE user_id = ?))
    AND user_id != ?;`;

  // 읽지 않은 메세지 개수를 가져오기 위한 쿼리문
  let sql2 = `SELECT c.room_id, c.user_nickname, c.user_id, c.createdAt, COALESCE(COUNT(m.read_or_not), 0) AS read_count
    FROM chatroom_list AS c 
    LEFT JOIN chat_message AS m ON c.room_id = m.room_id AND m.read_or_not = 1 AND m.user_id != ?
    WHERE c.room_id IN ((SELECT room_id FROM chatroom_list WHERE user_id = ?)) AND c.user_id != ?
    GROUP BY c.room_id;`

  try {
    // db connection pool을 가져오고, query문 수행
    let result = await pool.query(sql, [req.user.id, req.user.id]);
    let readOrNot = await pool.query(sql2, [req.user.id, req.user.id, req.user.id])

    res.send({result, readOrNot});
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});

// 새로운 채팅방 생성하는 쿼리문(기존에 존재하는지 검사 거칠 필요 있음)
router.get('/newChatroom', isLoggedIn, async (req, res) => {
  let sql = 'INSERT INTO chatroom (product_id) VALUES (?)';

  try {
    // 추후에 product_id 상품 페이지에서 받아서 넣어주어야 함!!
    let result = await pool.query(sql, [null]);

    // result.insertId 로 새로 생성된 row의 id 가져올 수 있음
    res.send(result);
  }  catch (error) {
    console.error(error);
    res.send('error');
  }
});

// 채팅방에 속한 메세지와 product 정보 가져오는 API
router.get('/getChatMsg/:roomId', isLoggedIn, async (req, res) => {

  const {roomId} = req.params

  let sql = 'SELECT * FROM chat_message WHERE room_id = ?';

  try {
    let result = await pool.query(sql, [roomId]);
    
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});

router.put('/setBuyerId', async (req, res) => {
  const targetId = req.body.targetId
  const productId = req.body.productId
  
  const date = new Date()
  
  let sql = "UPDATE product SET buyer_id = ?, soldDate = ? WHERE id = ?";
  let sql2 = "DELETE FROM liked WHERE product_id = ?"

  try {
    let result = await pool.query(sql, [targetId, date, productId])
    let result2 = await pool.query(sql2, [productId])
    res.send(result)
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});

router.delete('/', (req, res) => {

});

module.exports = router;