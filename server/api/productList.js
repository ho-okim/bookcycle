const router = require('express').Router();
const pool = require("../db.js"); // db connection pool

router.get('/productList', async (req, res) => {
    // query문 설정
    let sql = 'SELECT * FROM product';

    // db connection pool을 가져오고, query문 수행
    let result = await pool.query(sql);
    res.send(result);
});

router.post('/', (req, res) => {

});

router.put('/', (req, res) => {

});

router.delete('/', (req, res) => {

});

module.exports = router;