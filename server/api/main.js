const router = require("express").Router();
const pool = require("../db.js"); // db connection pool

router.get("/mainBook", async (req, res) => {
  // product 테이블에서 createdAt 내림차순 정렬 후 상위 5개 추출
  let sql = "SELECT * FROM product_simple_data WHERE blocked != 1 AND (soldDate IS NULL OR seller_id = buyer_id) ORDER BY createdAt DESC LIMIT 18";

  // db connection pool을 가져오고, query문 수행
  let result = await pool.query(sql);
  res.send(result);
  // 해당 result는 client > src > api > main.js에서 받아서 사용함
});

router.get("/mainBoard", async (req, res) => {
  // board 테이블에서 createdAt 내림차순 정렬 후 상위 10개 추출
  let sql = "SELECT * FROM board_user  WHERE blocked != 1 ORDER BY createdAt DESC LIMIT 10";

  // db connection pool을 가져오고, query문 수행
  let result = await pool.query(sql);
  res.send(result);
  // 해당 result는 client > src > api > main.js에서 받아서 사용함
});

router.put("/", (req, res) => {});

router.delete("/", (req, res) => {});

module.exports = router;
