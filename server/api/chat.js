const router = require('express').Router();
const pool = require("../db.js"); // db connection pool
const { isLoggedIn, isLoggedInAndBlocked } = require("../lib/auth.js");
const mysql = require("mysql2")

router.get('/chatlist', isLoggedIn, async (req, res) => {

  // 로그인 한 유저가 갖고 있는 채팅방 목록 가져오기 위한 쿼리문
  let sql = 'CALL users_chat_list(?)';

  // 읽지 않은 메세지 개수를 가져오기 위한 쿼리문
  let sql2 = 'CALL chat_read_or_not(?)';

  try {
    // db connection pool을 가져오고, query문 수행
    const query = mysql.format(sql, [req.user.id]);
    const query2 = mysql.format(sql2, [req.user.id]);

    let result = await pool.query(query);
    let readOrNot = await pool.query(query2);

    res.send({result, readOrNot});
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});

router.get('/chat/readOrNot', isLoggedIn, async (req, res) => {

  // 읽지 않은 메세지 개수를 가져오기 위한 쿼리문
  let sql = 'CALL chat_read_or_not(?)';

  try {
    // db connection pool을 가져오고, query문 수행
    const query = mysql.format(sql, [req.user.id]);
    let result = await pool.query(query);

    res.send(result);
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});

// 새로운 채팅방 생성하는 쿼리문(기존에 존재하는지 검사 거칠 필요 있음)
router.post('/newChatroom/:id', isLoggedInAndBlocked, async (req, res) => {
  // id는 product_id
  const { id } = req.params;
  const {seller_id} = req.body; // product의 user_id

  let findChatroomSql = 'SELECT * FROM chatroom_list WHERE product_id = ? AND user_id = ?';
  let sql = 'INSERT INTO chatroom (product_id) VALUES (?)';
  let insertUserSql = 'INSERT INTO chat_user (chatroom_id, user_id) VALUES (?, ?)';

  const findChatroom = mysql.format(findChatroomSql, [id, req.user.id]);
  const query = mysql.format(sql, [id]);

  try {
    let isExist = await pool.query(findChatroom)

    if(isExist.length === 0){
      // 새로운 채팅방 개설
      let result = await pool.query(query);
      
      // 유저 insert
      const insertUserQuery = mysql.format(insertUserSql, [result.insertId, req.user.id]);
      const insertUserQuery2 = mysql.format(insertUserSql, [result.insertId, seller_id]);
      await pool.query(insertUserQuery);
      await pool.query(insertUserQuery2);

      res.send(result);
    } else {
      res.send(isExist) // 채팅방의 아이디를 보냄
    }
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

router.put('/chat/exit', async (req, res) => {
  const {productId, findCRUserId} = req.body;
  const userId = req.user.id
  // 이 결과값이 존재한다면 exit_user_id에 내 아이디를 넣고, 존재하지 않으면 전부 삭제
  // 주의 : chatroom 삭제 시 product_id로 삭제하면 절대 안 됨 동일한 상품에 여러개의 채팅방 존재함 => 반드시 id로 삭제 필요
  let isExitSql = 'SELECT * FROM chatroom_list WHERE product_id = ? AND user_id = ?';
  let updateExitUserSql = "UPDATE chatroom SET exit_user_id = ? WHERE id = ?";
  let deleteChatroomSql = 'DELETE FROM chatroom WHERE id = ?'

  const isExitQuery = mysql.format(isExitSql, [productId, findCRUserId])

  try {
    let isExit = await pool.query(isExitQuery)

    if(!isExit[0].exit_user_id){
      // isExit가 null이므로 자신의 아이디를 exit_user_id에 넣으면 됨
      const updateExitUserQuery = mysql.format(updateExitUserSql, [userId, isExit[0].room_id])
      let result = await pool.query(updateExitUserQuery);

      res.send(result);
    } else {
      // isExit이 존재하지 않으므로 chatroom을 삭제(chat_user, chat_message는 CASCADE)
      console.log(isExit[0].room_id)
      let result = await pool.query(deleteChatroomSql, [isExit[0].room_id])

      res.send(result);
    }
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});

module.exports = router;