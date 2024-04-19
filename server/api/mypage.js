const router = require('express').Router();
const pool = require("../db.js"); // db connection pool

router.get("/getProductAll", async (req, res) => {
    // product 테이블에서 createdAt 내림차순 정렬
    let sql = "SELECT * FROM product ORDER BY createdAt";
  
    let result = await pool.query(sql);
    res.send(result);
    // 해당 result는 client > src > api > mypage.js에서 받아서 사용함
  });

router.get('/mypage/:id', async (req, res) => {
    let { id } = req.params;
    // query문 설정
    let sql = 'SELECT * FROM users WHERE id = ?';

    // db connection pool을 가져오고, query문 수행
    let result = await pool.query(sql, [id]);
    res.send(result);
});

router.post('/', (req, res) => {

});

router.put('/', (req, res) => {

});

router.delete('/', (req, res) => {

});

module.exports = router;