const router = require("express").Router();
const mysql = require('mysql2');
const pool = require("../db.js"); // db connection pool
const { isLoggedIn } = require("../lib/auth.js");
const bcrypt = require("bcrypt");

// 구매내역 페이지
router.get("/mypage/buyList", isLoggedIn, async (req, res) => {
  const { id } = req.user;

  let sql = "CALL buy_list(?, ?, ?)";

  try {
    const query = mysql.format(sql, [id, id, 'createdAt']);
    const result = await pool.query(query);
    res.send(result);
    // 해당 result는 client > src > api > mypage.js에서 받아서 사용함
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});

// 구매 후 남긴후기 페이지
router.get("/mypage/buyGiveReviewList", isLoggedIn, async (req, res) => {
  const { id } = req.user;

  let sql = "SELECT * FROM trade_review WHERE buyer_id = ? AND writer_id = ?";

  try {
    const query = mysql.format(sql, [id, id]);
    const result = await pool.query(query);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});

// 구매 후 받은후기 페이지
router.get("/mypage/buyGetReviewList", isLoggedIn, async (req, res) => {
  const { id } = req.user;

  let sql = "SELECT * FROM trade_review WHERE buyer_id = ? AND writer_id != ?";

  try {
    const query = mysql.format(sql, [id, id]);
    const result = await pool.query(query);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});

// 찜한책 페이지
router.get("/mypage/heartList", isLoggedIn, async (req, res) => {
  const { id } = req.user;
  const { sortOption } = req.query;

  let sql = "SELECT H.*, P.soldDate, P.seller_id, P.liked, P.view_count, U.nickname AS seller_nickname FROM user_liked_product H JOIN product P ON P.id = H.product_id JOIN users U ON P.seller_id = U.id WHERE H.user_id = ? AND (image_no = 0 OR image_no IS NULL)"
  const orderBy = sortOption.split('.');
  sql += ` ORDER BY H.${orderBy[0]} ${orderBy[1]}`;
  
  try {
    const query = mysql.format(sql, [id]);
    const result = await pool.query(query);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});

// 판매내역 페이지
router.get("/mypage/sellList", isLoggedIn, async (req, res) => {
  const { id } = req.user;

  let sql = "CALL sell_list(?, ?, ?)";

  try {
    const query = mysql.format(sql, [id, id, 'createdAt']);
    const result = await pool.query(query);
    res.send(result);
    // 해당 result는 client > src > api > mypage.js에서 받아서 사용함
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});

// 판매 후 남긴 후기 페이지
router.get("/mypage/sellGiveReviewList", isLoggedIn, async (req, res) => {
  const { id } = req.user;

  let sql = "SELECT * FROM trade_review WHERE seller_id = ? AND writer_id = ?";
  try {
    const query = mysql.format(sql, [id, id]);
    const result = await pool.query(query);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});

// 판매 후 받은 후기 페이지
router.get("/mypage/sellGetReviewList", isLoggedIn, async (req, res) => {
  const { id } = req.user;

  let sql = "SELECT * FROM trade_review WHERE seller_id = ? AND writer_id != ?";
  try {
    const query = mysql.format(sql, [id, id]);
    const result = await pool.query(query);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});


// 상품 게시 목록
router.get("/mypage/productPostList", isLoggedIn, async (req,res) => {
  const { id } = req.user;
  const { sortOption } = req.query;

  let sql = "SELECT P.id, P.product_name, P.price, P.createdAt, PI.filename FROM product P LEFT JOIN product_image PI ON PI.product_id = P.id WHERE seller_id = ? AND buyer_id = ?  AND (boardNo = 0 OR boardNo IS NULL)";

  const orderBy = sortOption.split('.');
  sql += ` ORDER BY ${orderBy[0]} ${orderBy[1]}`;


  try {
    const query = mysql.format(sql, [id, id]);
    const result = await pool.query(query);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send('error');
  }
})

// 게시판 게시글 목록
router.get("/mypage/boardPostList", isLoggedIn, async (req,res) => {
  const { id } = req.user;
  const { sortOption } = req.query;

  let sql = "SELECT U.*, I.boardNo, I.filename FROM board_user U LEFT JOIN board_image I ON U.id = I.board_id WHERE U.user_id = ? AND (I.boardNo = 0 OR I.boardNo IS NULL)";

  const orderBy = sortOption.split('.');
  sql += ` ORDER BY ${orderBy[0]} ${orderBy[1]}`;

  try {
    const query = mysql.format(sql, [id]);
    const result = await pool.query(query);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send('error');
  }
})


// 회원정보관리 - 비밀번호 확인
router.post('/mypage/confirmPassword', isLoggedIn, async (req, res) => {

  const { password } = req.body;
  const id = req.user.id;

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
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "fail" });
    }

    // 비밀번호가 일치하면 성공 응답
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류" });
  }
});

// 회원정보관리 페이지 - 데이터 조회
router.get("/mypage/edit", isLoggedIn, async (req, res) => {
  let { id } = req.user;

  // query문 설정
  let sql = "SELECT * FROM users WHERE id = ?";

  // db connection pool을 가져오고, query문 수행
  const query = mysql.format(sql, [id]);
  const result = await pool.query(query);

  if (!result) {
    return res.status(404).send("사용자 정보를 찾을 수 없습니다");
  }

  res.send(result); 
});

// 회원정보 수정
router.put("/mypage/edit", isLoggedIn, async(req, res) => { 
  const { id } = req.user;
  let { formData } = req.body;

  let sql = "UPDATE users SET username = ?, nickname = ?, password = ?, phone_number = ? WHERE id = ?";

  const query = mysql.format(sql, [formData.username, formData.nickname, await bcrypt.hash(formData.password, 10), formData.phone_number, id]);
  await pool.query(query);

  res.send("사용자 정보가 수정되었습니다.")
});


// 리뷰작성 페이지 - 내가 구매자일 때 
router.get("/user/:id/sellerReviewWrite", isLoggedIn, async(req, res) => {

  // 태그 정보 조회
  let sql = "SELECT * FROM tag WHERE review_target = 'both' OR review_target = 'seller'";
  const query = mysql.format(sql);
  const result = await pool.query(query);
  
  // 태그 정보를 클라이언트에게 전송
  res.send(result);
})

// 리뷰 작성 - 내가 구매자일 때 
router.post("/user/:id/sellerReviewWrite", isLoggedIn, async (req, res) => {
  try {
    // 리뷰작성자 = 나 = req.user(구매자)

    // 내가 후기 남기는 사람(판매자)
    const { id } = req.params;

    // client에서 보낸 request body
    const { score, tagIndex, reviewContent, productId } = req.body;
  
    // 필요한 데이터가 모두 채워져 있는지 확인
    if (!score || !reviewContent || !tagIndex) {
      console.log("필수 데이터가 누락")
      return res.status(400).send("필수 데이터가 누락되었습니다.");
    }
  
    let reviewSql = `INSERT INTO review (buyer_id, seller_id, content, score, product_id, writer_id) VALUES (?, ?, ?, ?, ?, ?)`;
    const reviewQuery = mysql.format(reviewSql, [req.user.id, id, reviewContent, score, productId, req.user.id]);
    const reviewResult = await pool.query(reviewQuery);
  
    // 리뷰 작성 후 리뷰 ID를 가져오는 SQL 쿼리
    const reviewId = reviewResult.insertId;

    let tagSql = `INSERT INTO review_tag (review_id, tag_id) VALUES (?, ?)`
    const tagQuery = mysql.format(tagSql, [reviewId, tagIndex]);
    const tagResult = await pool.query(tagQuery);
    
    res.send(tagResult);
  } catch (error) {
    console.log(error)
  }

});

// 리뷰작성 페이지 - 내가 판매자일 때 
router.get("/user/:id/buyerReviewWrite", isLoggedIn, async(req, res) => {

  // 태그 정보 조회
  let sql = "SELECT * FROM tag WHERE review_target = 'both' OR review_target = 'buyer'";
  const query = mysql.format(sql);
  const result = await pool.query(query);
  
  // 태그 정보를 클라이언트에게 전송
  res.send(result);
})

// 리뷰 작성 - 내가 판매자일 때 
router.post("/user/:id/buyerReviewWrite", isLoggedIn, async (req, res) => {
  try {
    
    // 내가 후기 남기는 사람(구매자)
    const { id } = req.params;

    // 리뷰작성자 = 나 = req.user(판매자)

    // client에서 보낸 request body
    const { score, tagIndex, reviewContent, productId } = req.body;
  
    // 필요한 데이터가 모두 채워져 있는지 확인
    if (!score || !reviewContent || !tagIndex) {
      console.log("필수 데이터가 누락")
      return res.status(400).send("필수 데이터가 누락되었습니다.");
    }
  
    let reviewSql = `INSERT INTO review (buyer_id, seller_id, content, score, product_id, writer_id) VALUES (?, ?, ?, ?, ?, ?)`;
    const reviewQuery = mysql.format(reviewSql, [id, req.user.id, reviewContent, score, productId, req.user.id]);
    const reviewResult = await pool.query(reviewQuery);
  
    // 리뷰 작성 후 리뷰 ID를 가져오는 SQL 쿼리
    const reviewId = reviewResult.insertId;

    let tagSql = `INSERT INTO review_tag (review_id, tag_id) VALUES (?, ?)`
    const tagQuery = mysql.format(tagSql, [reviewId, tagIndex]);
    const tagResult = await pool.query(tagQuery);
    
    res.send(tagResult);
  } catch (error) {
    console.log(error)
  }

});

// 리뷰 수정 페이지 - 내가 구매자일 때
router.get("/user/:id/sellerReviewEdit", isLoggedIn, async(req, res) => {
  const { productId } = req.query;

  let sql = "SELECT R.score, R.content, R.buyer_id, R.writer_id, RT.tag_id FROM review R JOIN review_tag RT ON R.id = RT.review_id WHERE R.product_id = ? AND R.buyer_id = R.writer_id";
  const query = mysql.format(sql, [productId]);
  const result = await pool.query(query);
  
  // 태그 정보를 클라이언트에게 전송
  res.send(result);
})


// 리뷰 수정 - 내가 구매자일 때
router.put("/user/:id/sellerReviewEdit", isLoggedIn, async (req, res) => {

  // seller_id
  const { id } = req.params;
  
  // client에서 보낸 request body
  const { score, tagIndex, reviewContent, productId } = req.body;

  // 필요한 데이터가 모두 채워져 있는지 확인
  if (!score || !reviewContent || !tagIndex) {
    return res.status(400).send("필수 데이터가 누락되었습니다.");
  }

  let reviewSql = `UPDATE review SET buyer_id =?, seller_id =?, content = ?, score =? WHERE product_id = ?`;
  let tagSql = `UPDATE review_tag SET tag_id = ? WHERE review_id = ?`

  try {
    const reviewQuery = mysql.format(reviewSql, [req.user.id, id, reviewContent, score, productId]);
    const reviewResult = await pool.query(reviewQuery);

    // 리뷰 작성 후 리뷰 ID를 가져오는 SQL 쿼리
    const reviewId = reviewResult.insertId;
    const tagQuery = mysql.format(tagSql, [tagIndex, reviewId]);
    const tagResult = await pool.query(tagQuery);

    res.send({review: reviewResult, tag: tagResult});
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});

// 리뷰 수정 페이지 - 내가 판매자일 때
router.get("/user/:id/buyerReviewEdit", isLoggedIn, async(req, res) => {
  const { productId } = req.query;

  let sql = "SELECT R.score, R.content, R.buyer_id, R.writer_id, RT.tag_id FROM review R JOIN review_tag RT ON R.id = RT.review_id WHERE R.product_id = ? AND R.buyer_id != R.writer_id";

  const query = mysql.format(sql, [productId]);
  const result = await pool.query(query);
  
  // 태그 정보를 클라이언트에게 전송
  res.send(result);
})


// 리뷰 수정 - 내가 판매자일 때
router.put("/user/:id/buyerReviewEdit", isLoggedIn, async (req, res) => {

  // buyer_id
  const { id } = req.params;
  
  // client에서 보낸 request body
  const { score, tagIndex, reviewContent, productId } = req.body;

  // 필요한 데이터가 모두 채워져 있는지 확인
  if (!score || !reviewContent || !tagIndex) {
    return res.status(400).send("필수 데이터가 누락되었습니다.");
  }

  let reviewSql = `UPDATE review SET buyer_id =?, seller_id =?, content = ?, score =? WHERE product_id = ?`;
  let tagSql = `UPDATE review_tag SET tag_id = ? WHERE review_id = ?`

  try {
    const reviewQuery = mysql.format(reviewSql, [id, req.user.id, reviewContent, score, productId]);
    const reviewResult = await pool.query(reviewQuery);

    // 리뷰 작성 후 리뷰 ID를 가져오는 SQL 쿼리
    const reviewId = reviewResult.insertId;
    const tagQuery = mysql.format(tagSql, [tagIndex, reviewId]);
    const tagResult = await pool.query(tagQuery);

    res.send({review: reviewResult, tag: tagResult});
  } catch (error) {
    console.error(error);
    res.send('error');
  }
});

// 리뷰 삭제
router.delete("/reviewDelete/:id", isLoggedIn, async (req, res) => {
  try {
    // 제약조건 > review_tag삭제 후 review 삭제

    // review_id
    let { id } = req.params;
  
    let tagDeleteSql = "DELETE FROM review_tag WHERE review_id = ?";
    const tagDeleteQuery = mysql.format(tagDeleteSql, [id]);
    await pool.query(tagDeleteQuery);
  
    let reviewDeleteSql = "DELETE FROM review WHERE id = ?";
    const reviewDeleteQuery = mysql.format(reviewDeleteSql, [id]);
    await pool.query(reviewDeleteQuery);
  
    return res.status(200).send("success");
  } catch(error) {
    console.error(error);
    return res.status(404).send("fail");
  }
});


// 프로필 사진 업로드 위한 패키지 require
const path = require('path')
const multer = require('multer')
const uuid4 = require('uuid4')
// 파일 시스템 함수 require
const fs = require('fs')

// 미들웨어 설정
const upload = multer({
  storage: multer.diskStorage({
    filename(req, file, done) {
      const randomID = uuid4();
      const ext = path.extname(file.originalname);
      const filename = randomID + ext;
      done(null, filename);
    },
    destination(req, file, done) {
      done(null, path.join(__dirname, "../../client/public/img/profile"));
    },
  }),
  limits: { fileSize: 1024 * 1024 },
});

// 프로필 파일 업로드
router.post('/profileupload', isLoggedIn, upload.array('files', 1), async(req, res)=>{
  let sql = 'UPDATE users SET profile_image = ? WHERE id = ?';
  let result
  const files = req.files[0]
  const {delProfile} = req.body

  try {
    if(files){ // 새 파일로 데이터베이스 업데이트
      result = await pool.query(sql, [files.filename, req.user.id])
      if(delProfile){ // 기존 프로필 존재하면 삭제
        fs.unlink(`./client/public/img/profile/${delProfile}`, (err)=>{
          if (err) console.error(err);
        })
      }
    } else {
      result = await pool.query(sql, [delProfile, req.user.randomID])
    }
  
    res.send(result);
  } catch (error) {
    console.log('profileupload UPDATE 과정에서 오류 발생 : ', error)
  }
})

module.exports = router;