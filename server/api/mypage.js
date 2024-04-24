const router = require("express").Router();
const pool = require("../db.js"); // db connection pool


router.get("/mypage/:id", async (req, res) => {
  let { id } = req.params;

  // query문 설정
  let sql = "SELECT * FROM users WHERE id = ?";

  // db connection pool을 가져오고, query문 수행
  let result = await pool.query(sql, [id]);
  console.log('mypage user: ', result)

  if (!result) {
    return res.status(404).send("사용자 정보를 찾을 수 없습니다");
  }

  res.send(result); 
});


router.get("/mypage/:id/buyList", async (req, res) => {
  let { id } = req.params;

  // product 테이블에서 createdAt 내림차순 정렬
  let sql = "SELECT * FROM product WHERE buyer_id = ?";

  let result = await pool.query(sql, [id]);
  res.send(result);
  // 해당 result는 client > src > api > mypage.js에서 받아서 사용함
});

router.get("/mypage/:id/buyReviewList", async (req, res) => {
  let { id } = req.params;

  let sql = "SELECT * FROM review WHERE buyer_id = ?";

  let result = await pool.query(sql, [id]);
  res.send(result);
});










// router.put("/", async(req, res) => {
//   let { id } = req.params;
//   let { name, nickname, phone_number, email } = req.body;

//   let loginUser = req.user ? req.user.userid : null;

//   if(!loginUser) {
//     return res.status(401).send("로그인이 필요합니다");
//   }

//   let sql = "UPDATE users SET name = ?, nickname = ?, phone_number = ?, email = ? WHERE id = ?";

//   await pool.query(sql, [name, nickname, phone_number, email, id]);

//   res.send("사용자 정보가 수정되었습니다.")
// });


router.post("/", (req, res) => {});

router.delete("/", (req, res) => {});

module.exports = router;
