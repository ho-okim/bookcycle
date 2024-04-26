const router = require('express').Router();
const pool = require("../db.js"); // db connection pool

router.get('/chatlist', async (req, res) => {
  const loginUser = req.user ? req.user : null
  console.log(loginUser)

  if(loginUser){
    // query문 설정
    let sql = "SELECT * FROM chatroom_list WHERE id = ?";
  
    // db connection pool을 가져오고, query문 수행
    let result = await pool.query(sql, [loginUser.id]);
  
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