const router = require("express").Router();
const pool = require("../db.js"); // db connection pool
const { isLoggedIn } = require("../lib/auth.js");
const bcrypt = require("bcrypt");

// 구매내역 페이지
router.get("/mypage/:id/buyList", isLoggedIn, async (req, res) => {
  let { id } = req.params;

  // product 테이블에서 createdAt 정렬
  let sql = "SELECT * FROM trade_list WHERE buyer_id = ?";
  const result = await pool.query(sql, [id]);

  res.send(result);
  // 해당 result는 client > src > api > mypage.js에서 받아서 사용함
});

// 구매후기 페이지
router.get("/mypage/:id/buyReviewList", isLoggedIn, async (req, res) => {
  let { id } = req.params;

  let sql = "SELECT * FROM trade_review WHERE buyer_id = ?";

  const result = await pool.query(sql, [id]);
  res.send(result);
});

// 찜한책 페이지
router.get("/mypage/:id/heartList", isLoggedIn, async (req, res) => {
  let { id } = req.params;

  let sql = "SELECT H.*, P.sold, P.seller_id FROM user_liked_product H JOIN product P ON P.id = H.product_id WHERE user_id = ? ORDER BY liked_date DESC"
  
  const result = await pool.query(sql, [id]);
  res.send(result);
});

// 판매내역 페이지
router.get("/mypage/:id/sellList", isLoggedIn, async (req, res) => {
  let { id } = req.params;

  let sql = "SELECT * FROM trade_list WHERE seller_id = ?";

  const result = await pool.query(sql, [id]);
  res.send(result);
});

// 판매후기 페이지
router.get("/mypage/:id/sellReviewList", isLoggedIn, async (req, res) => {
  let { id } = req.params;

  let sql = "SELECT * FROM trade_review WHERE seller_id = ?";

  const result = await pool.query(sql, [id]);
  res.send(result);
});

// 회원정보관리 페이지
router.get("/mypage/:id/edit", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  // console.log(id)

  // query문 설정
  let sql = "SELECT * FROM users WHERE id = ?";

  // db connection pool을 가져오고, query문 수행
  const result = await pool.query(sql, [id]);
  // console.log('mypage user: ', result)

  if (!result) {
    return res.status(404).send("사용자 정보를 찾을 수 없습니다");
  }

  res.send(result); 
});


// 회원정보관리 - 비밀번호 확인
router.post('/mypage/:id/edit', async (req, res) => {

  const { id, password } = req.body;
  console.log("id: ", id)
  console.log("비밀번호: ", password)

  // 현재 로그인한 사용자의 id를 가진 user 정보 가져와서
  // 입력받은 비밀번호와 user의 비밀번호가 동일한지 검사
  try {
    let sql = "SELECT * FROM users WHERE id = ?";
    const result = await pool.query(sql, [id])

    // 사용자 존재 여부 확인
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    const hashedPassword = result[0].password; // db에 저장된 해싱된 비밀번호
    console.log("hashedPassword: ", hashedPassword)

    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log("isMatch", isMatch)

    if (!isMatch) {
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    // 비밀번호가 일치하면 성공 응답
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류" });
  }
});


// 회원정보 수정
router.put("/mypage/:id/edit", async(req, res) => { 
  const { id } = req.params;
  let { formData } = req.body;
  console.log("서버 - formData :", req.body)

  // 비밀번호 bcrypt 해시해서 값 넣기

  let sql = "UPDATE users SET username = ?, nickname = ?, password = ?, phone_number = ? WHERE id = ?";

  await pool.query(sql, [formData.username, formData.nickname, await bcrypt.hash(formData.password, 10), formData.phone_number, id]);

  res.send("사용자 정보가 수정되었습니다.")
});


// 리뷰작성 페이지
router.get("/user/:id/reviewWrite", isLoggedIn, async(req, res) => {

  // 태그 정보 조회
  let sql = "SELECT * FROM tag";
  const result = await pool.query(sql);
  
  // 태그 정보를 클라이언트에게 전송
  res.send(result);
})

// 리뷰작성
router.post("/user/:id/reviewWrite", async (req, res) => {
  try {
    
    // seller_id
    const { id } = req.params;

    // client에서 보낸 request body
    const { score, tagIndex, reviewContent, productId } = req.body;
  
    // 필요한 데이터가 모두 채워져 있는지 확인
    if (!score || !reviewContent || !tagIndex) {
      console.log("필수 데이터가 누락")
      return res.status(400).send("필수 데이터가 누락되었습니다.");
    }
  
    let reviewSql = `INSERT INTO review (buyer_id, seller_id, content, score, product_id) VALUES (?, ?, ?, ?, ?)`;
      
    const reviewResult = await pool.query(reviewSql, [req.user.id, id, reviewContent, score, productId]);
  
    // 리뷰 작성 후 리뷰 ID를 가져오는 SQL 쿼리
    const reviewId = reviewResult.insertId;

    let tagSql = `INSERT INTO review_tag (review_id, tag_id) VALUES (?, ?)`
    const tagResult = await pool.query(tagSql, [reviewId, tagIndex]);
    
    res.send(tagResult);
  } catch (error) {
    console.log(error)
  }

});

// 리뷰수정 페이지
router.get("/user/:id/reviewEdit", isLoggedIn, async(req, res) => {
  const { id } = req.params;
  const { productId } = req.query;
  console.log(productId)

  let sql = "SELECT R.score, R.content, RT.tag_id FROM review R JOIN review_tag RT ON R.id = RT.review_id WHERE R.product_id = ?";
  const result = await pool.query(sql, [productId]);

  console.log("result :", result)
  
  // 태그 정보를 클라이언트에게 전송
  res.send(result);
})


// 리뷰 수정
router.put("/user/:id/reviewEdit", async (req, res) => {

  // seller_id
  const { id } = req.params;
  
  // client에서 보낸 request body
  const { score, tagIndex, reviewContent, productId } = req.body;

  // 필요한 데이터가 모두 채워져 있는지 확인
  if (!score || !reviewContent || !tagIndex) {
    return res.status(400).send("필수 데이터가 누락되었습니다.");
  }

  let reviewSql = `UPDATE review SET buyer_id =?, seller_id =?, content = ?, score =? WHERE product_id = ?`;

  const reviewResult = await pool.query(reviewSql, [req.user.id, id, reviewContent, score, productId]);

  // 리뷰 작성 후 리뷰 ID를 가져오는 SQL 쿼리
  const reviewId = reviewResult.insertId;

  let tagSql = `UPDATE review_tag SET tag_id = ? WHERE review_id = ?`

  const tagResult = await pool.query(tagSql, [tagIndex, reviewId]); 
  res.send({review: reviewResult, tag: tagResult});
});

// 리뷰 삭제
router.delete("/reviewDelete/:id", async (req, res) => {
  try {
    // 제약조건 > review_tag삭제 후 review 삭제

    // review_id
    let { id } = req.params;
  
    let tagDeleteSql = "DELETE FROM review_tag WHERE review_id = ?";
    let tagDeleteResult = await pool.query(tagDeleteSql, [id]);
  
    let reviewDeleteSql = "DELETE FROM review WHERE id = ?";
    let reviewDeleteResult = await pool.query(reviewDeleteSql, [id]);
  
    return res.status(200).send("success");
  } catch(error) {
    console.error(error);
    return res.status(404).send("fail");
  }
});

module.exports = router;
