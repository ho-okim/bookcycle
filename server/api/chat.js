const router = require('express').Router();
const pool = require("../db.js"); // db connection pool
const { isLoggedIn } = require("../lib/auth.js");
const mysql = require("mysql2")

router.get('/chatlist', isLoggedIn, async (req, res) => {

  // 로그인 한 유저가 갖고 있는 채팅방 목록 가져오기 위한 쿼리문
  let sql = 'CALL users_chat_list(?)';

  // 읽지 않은 메세지 개수를 가져오기 위한 쿼리문
  let sql2 = 'CALL chat_read_or_not(?)';

  try {
    // db connection pool을 가져오고, query문 수행
    const query = mysql.format(sql, [req.user.id]);

    let result = await pool.query(query);
    let readOrNot = await pool.query(sql2, [req.user.id])

    res.send({result, readOrNot});
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});

// 새로운 채팅방 생성하는 쿼리문(기존에 존재하는지 검사 거칠 필요 있음)
router.get('/newChatroom', isLoggedIn, async (req, res) => {
  let sql = 'INSERT INTO chatroom (product_id) VALUES (?)';
  const query = mysql.format(sql, [null]);

  try {
    // 추후에 product_id 상품 페이지에서 받아서 넣어주어야 함!!
    let result = await pool.query(query);

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
  const query = mysql.format(sql, [roomId]);

  try {
    let result = await pool.query(query);
    
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

  const query = mysql.format(sql, [targetId, date, productId]);
  const query2 = mysql.format(sql, [productId]);

  try {
    let result = await pool.query(query)
    let result2 = await pool.query(query2)
    res.send(result)
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});

router.delete('/', (req, res) => {

});

module.exports = router;