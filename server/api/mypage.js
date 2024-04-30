const router = require("express").Router();
const pool = require("../db.js"); // db connection pool
const { isLoggedIn } = require("../lib/auth.js");

// 회원정보관리 페이지
router.get("/mypage/:id/edit", isLoggedIn, async (req, res) => {
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

// 구매내역 페이지
router.get("/mypage/:id/buyList", isLoggedIn, async (req, res) => {
  let { id } = req.params;

  // product 테이블에서 createdAt 정렬
  let sql = "SELECT * FROM product WHERE buyer_id = ?";

  let result = await pool.query(sql, [id]);
  res.send(result);
  // 해당 result는 client > src > api > mypage.js에서 받아서 사용함
});

// 구매후기 페이지
router.get("/mypage/:id/buyReviewList", isLoggedIn, async (req, res) => {
  let { id } = req.params;

  let sql = "SELECT * FROM review WHERE buyer_id = ?";

  let result = await pool.query(sql, [id]);
  res.send(result);
});

// 판매내역 페이지
router.get("/mypage/:id/sellList", isLoggedIn, async (req, res) => {
  let { id } = req.params;

  let sql = "SELECT * FROM product WHERE seller_id = ?";

  let result = await pool.query(sql, [id]);
  res.send(result);
});

// 판매후기 페이지
router.get("/mypage/:id/sellReviewList", isLoggedIn, async (req, res) => {
  let { id } = req.params;

  let sql = "SELECT * FROM review WHERE seller_id = ?";

  let result = await pool.query(sql, [id]);
  res.send(result);
});

// 찜한책 페이지
router.get("/mypage/:id/heartList", isLoggedIn, async (req, res) => {
  let { id } = req.params;

  let sql = "SELECT product.*, users.*, seller.* FROM liked JOIN product ON liked.product_id = product.id JOIN users ON liked.user_id = users.id JOIN users AS seller ON product.seller_id = seller.id WHERE liked.user_id = ?";
  
  let result = await pool.query(sql, [id]);
  res.send(result);
});

// 리뷰작성 페이지
router.get("/productDetail/:id/reviewWrite", isLoggedIn, async(req, res) => {
  let { id } = req.params;

  let sql = "SELECT * FROM tag";

  let result = await pool.query(sql, [id]);
  res.send(result);
})





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


router.post("/reviewWrite", async (req, res) => {
  // 로그인 된 사용자의 id 가져오기
  const userId = req.user.id;

  const newReview = {
    review: req.body.content
  }


});

router.delete("/", (req, res) => {});

module.exports = router;
