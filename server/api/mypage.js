const router = require("express").Router();
const { concurrently } = require("concurrently");
const pool = require("../db.js"); // db connection pool

// 회원정보관리 페이지
router.get("/mypage/:id/edit", async (req, res) => {
  const { id } = req.params;

  // query문 설정
  let sql = "SELECT * FROM users WHERE id = ?";

  // db connection pool을 가져오고, query문 수행
  const result = await pool.query(sql, [id]);
  console.log('mypage user: ', result)

  if (!result) {
    return res.status(404).send("사용자 정보를 찾을 수 없습니다");
  }

  res.send(result); 
});


router.put("/mypage/:id/edit", async(req, res) => { 
  const { id } = req.params;
  const { nickname, phone_number } = req.body;

  const loginUser = req.user ? req.user.userid : null;

  if(!loginUser) {
    return res.status(401).send("로그인이 필요합니다");
  }

  let sql = "UPDATE users SET nickname = ?, phone_number = ? WHERE id = ?";

  await pool.query(sql, [nickname, phone_number, id]);

  res.send("사용자 정보가 수정되었습니다.")
});


// 구매내역 페이지
router.get("/mypage/:id/buyList", async (req, res) => {
  const { id } = req.params;

  // product 테이블에서 createdAt 정렬
  let sql = "SELECT product.*, seller.nickname as seller_nickname, buyer.nickname as buyer_nickname FROM product JOIN users as seller ON product.seller_id = seller.id JOIN users as buyer ON product.buyer_id = buyer.id WHERE buyer_id = ?";

  const result = await pool.query(sql, [id]);
  res.send(result);
  // 해당 result는 client > src > api > mypage.js에서 받아서 사용함
});

// 구매후기 페이지
router.get("/mypage/:id/buyReviewList", async (req, res) => {
  const { id } = req.params;

  let sql = "SELECT review.*, buyer.nickname as buyer_nickname FROM review JOIN users as buyer ON review.buyer_id = buyer.id WHERE buyer_id = ?";

  const result = await pool.query(sql, [id]);
  res.send(result);
});

// 판매내역 페이지
router.get("/mypage/:id/sellList", async (req, res) => {
  const { id } = req.params;

  let sql = "SELECT product.*, seller.nickname as seller_nickname, buyer.nickname as buyer_nickname FROM product JOIN users as seller ON product.seller_id = seller.id JOIN users as buyer ON product.buyer_id = buyer.id WHERE seller_id = ?";

  const result = await pool.query(sql, [id]);
  res.send(result);
});

// 판매후기 페이지
router.get("/mypage/:id/sellReviewList", async (req, res) => {
  const { id } = req.params;

  let sql = "SELECT review.*, buyer.nickname as buyer_nickname FROM review JOIN users AS buyer ON review.buyer_id = buyer.id WHERE seller_id = ?";

  const result = await pool.query(sql, [id]);
  res.send(result);
});

// 찜한책 페이지
router.get("/mypage/:id/heartList", async (req, res) => {
  const { id } = req.params;

  let sql = "SELECT * FROM user_liked_product WHERE user_id = ?"
  
  const result = await pool.query(sql, [id]);
  res.send(result);
});

// 리뷰작성 페이지
router.get("/user/:id/reviewWrite", async(req, res) => {
  const { id } = req.params;

  // 상품 정보 조회
  let userSql = "SELECT * FROM users WHERE id = ?";

  const userResult = await pool.query(userSql, [id]);

  // 태그 정보 조회
  let tagSql = "SELECT * FROM tag";
  const tagResult = await pool.query(tagSql);

  // 조회된 상품 정보와 태그 정보를 클라이언트에게 전송
  res.send({ user: userResult, tags: tagResult });
})


// 리뷰작성
router.post("/user/:id/reviewWrite", async (req, res) => {

  // seller_id
  const { id } = req.params;
  
  // client에서 보낸 request body
  const { rating, tagIndex, reviewContent, productId } = req.body;
  console.log(productId)
  console.log('rating ;', rating)
  console.log('reviewContent ;', reviewContent)
  console.log('tagIndex ;', tagIndex)


  // 필요한 데이터가 모두 채워져 있는지 확인
  if (!rating || !reviewContent || !tagIndex) {
    return res.status(400).send("필수 데이터가 누락되었습니다.");
  }

  let reviewSql = `INSERT INTO review (buyer_id, seller_id, content, score, product_id) VALUES (?, ?, ?, ?, ?)`;
    
  const reviewResult = await pool.query(reviewSql, [req.user.id, id, reviewContent, rating, productId]);

  console.log(req.user)


  // 리뷰 작성 후 리뷰 ID를 가져오는 SQL 쿼리
  const reviewId = reviewResult.insertId;


  let tagSql = `INSERT INTO review_tag (review_id, tag_id) VALUES (?, ?)`
  const tagResult = await pool.query(tagSql, [reviewId, tagIndex]); 

  res.send({review: reviewResult, tag: tagResult});
});



router.delete("/", (req, res) => {});

module.exports = router;
