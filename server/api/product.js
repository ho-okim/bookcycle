const router = require('express').Router();
const mysql = require('mysql2');
const pool = require("../db.js"); // db connection pool
const { isLoggedIn, isLoggedInAndBlocked } = require("../lib/auth.js");
const { CHAR_REG } = require('../lib/regex_server.js');
// 파일 시스템 함수 require
const fs = require('fs');

// 상품 전체 수 조회
router.get('/productList/all', async (req, res) => {
    const { category_id, condition, stype } = req.query;
    let { search } = req.query;

    // query문
    let sql = 'SELECT COUNT(*) AS total FROM product_detail WHERE soldDate IS NULL AND blocked != 1';
    let variables = [];

    if (search !== 'null') {
        search = search.toLocaleLowerCase();
        sql += ` AND LOWER(${stype}) LIKE CONCAT('%', LOWER(?), '%')`;
        variables.push(search);
    }
    if (parseInt(category_id) !== 0) {
        sql += ' AND category_id = ?';
        variables.push(parseInt(category_id));
    }
    if (condition !== 'all') {
        sql += ' AND `condition` LIKE ?';
        variables.push(condition);
    }

    try {
        // 상품 전체 수 조회
        const query = mysql.format(sql, variables);
        const result = await pool.query(query);

        res.send(result);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

// 상품 목록 조회 - 필터링, 검색, 정렬
router.get('/productList/product', async (req, res) => {
    const { limit, offset, name, ascend, category_id, condition, stype } = req.query;
    let { search } = req.query;

    let newName = CHAR_REG.test(name) ? name.trim() : 'createdAt';

    // query문
    let sql = 'SELECT * FROM product_detail WHERE soldDate IS NULL AND blocked != 1';
    let variables = [];

    if (search !== 'null') {
        search = search.toLocaleLowerCase();
        if (stype === 'isbn') {
          sql += ` AND (? REGEXP '^[0-9]+$' AND ((CAST(? AS UNSIGNED) = isbn10 OR (CAST(? AS UNSIGNED) = isbn13))))`;
          variables.push(search, search, search);  
        } else {
          sql += ` AND (LOWER(${stype}) LIKE CONCAT('%', LOWER(?), '%'))`;
          variables.push(search);
        }
    }
    if (parseInt(category_id) !== 0) {
        sql += ' AND category_id = ?';
        variables.push(parseInt(category_id));
    }
    if (condition !== 'all') {
        sql += ' AND `condition` LIKE ?';
        variables.push(condition);
    }
    
    let order_sql = ` ORDER BY ${newName} ${ascend} LIMIT ? OFFSET ?`;
    variables.push(parseInt(limit), parseInt(offset));
    
    try {
        // 상품 목록 조회
        const query = mysql.format(sql+order_sql, variables);
        const body = await pool.query(query);

        res.send(body);
    } catch (error) {
        console.error(error);
        res.send('error');
    }
});

// 상품 정보 조회
router.get('/productDetail/:id', async (req, res) => {
    const { id } = req.params;
    
    // query문 설정
    let sql = "SELECT * FROM product_detail WHERE product_id = ?";
    let count_sql = "UPDATE product SET view_count = view_count + 1 WHERE id = ?";

    // db connection pool을 가져오고, query문 수행
    const query = mysql.format(sql, [id]);
    const count_query = mysql.format(count_sql, [id]);
    let [result] = await pool.query(query); //보안상을 위하여 query 문 작성하게 될 때 이런 식으로 할 것
    await pool.query(count_query);
    res.send(result);
});

// 좋아요 등록
router.post('/product/like/:id', isLoggedInAndBlocked, async(req, res)=>{
  let { id } = req.params;

  let sql = 'INSERT INTO liked (user_id, product_id) VALUES (?, ?)';

  try {
    const query = mysql.format(sql, [req.user.id, id]);
    const result = await pool.query(query);
    res.send(result);

  } catch (error){
    console.error(error);
    res.send('error')
  }
})

// 좋아요 삭제(취소)
router.post('/product/unLike/:id', isLoggedInAndBlocked, async(req, res)=>{
  let { id } = req.params;

  let sql = 'DELETE FROM liked WHERE user_id = ? AND product_id = ?';

  try{
    const query = mysql.format(sql, [req.user.id, id]);
    const result = await pool.query(query);
    res.send(result);

  } catch(error){
    console.error(error);
    res.send('error');
  }
})

// 좋아요 조회
router.get('/product/likeState/:id', isLoggedIn, async(req, res)=>{
  let { id } = req.params;

  try{
      let sql = 'SELECT user_id, product_id FROM liked WHERE user_id = ?';
      const query = mysql.format(sql, [req.user.id]);
      const result = await pool.query(query);

      res.send(result);
    } catch(error){
      console.error(error);
      res.send('error');
    }
})

// 상품 카테고리 조회
router.get('/product/category', async (req, res) => {
    // query문 설정
    const sql = "SELECT * FROM product_category";

    // db connection pool을 가져오고, query문 수행
    const result = await pool.query(sql);
    res.send(result);
});

// 상품 사진 조회
router.get('/product/file/:id', async(req, res)=>{
  let { id } = req.params;
  let sql = "SELECT id, boardNo, filename FROM product_image WHERE product_id = ? ORDER BY boardNo";
  const query = mysql.format(sql, [id]);

  try {
    let result = await pool.query(query);
    res.send(result)

  } catch(error) {
    console.error(error);
    res.send('error');
  }
})


// 상품 게시글 삭제
router.post('/product/delete/:id', isLoggedIn, async (req, res) => {
  let { id } = req.params;

  try {
      // 파일 시스템에서 파일 삭제하기 위해 기존 파일 이름 가져오는 쿼리 실행
      let sql = "SELECT * FROM product_image WHERE product_id = ?"
      const query = mysql.format(sql, [id]);
      let result = await pool.query(query);
      result.forEach((el)=>{
        fs.unlink(`./client/public/img/product/${el.filename}`, (err)=>{})
      })

      let sql2 = "DELETE FROM product_image WHERE product_id = ?";
      const query2 = mysql.format(sql2, [id]);
      await pool.query(query2);

      let sql3 = "DELETE FROM product WHERE id = ?";
      const query3 = mysql.format(sql3, [id]);
      let result3 = await pool.query(query3);

      res.send(result3);
  } catch (error) {
      console.error(error);

      res.status(500).json({ error: "An error occurred while processing the request" });
  }
});

// 상품 게시글 생성
router.post('/productWrite', isLoggedInAndBlocked, async(req, res)=>{
  let { id } = req.params;
  const {seller_id, category_id, product_name, condition, description, price, writer, publisher, publish_date, isbn10, isbn13} = req.body.data;

  console.log(req.body.data)
  let sql = 'INSERT INTO product (seller_id, buyer_id, category_id, product_name, `condition`, description, price, writer, publisher, publish_date, isbn10, isbn13) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  const query = mysql.format(sql, [seller_id, seller_id, category_id, product_name, condition, description, price, writer, publisher, publish_date, isbn10, isbn13]);

  try{
    let result = await pool.query(query);
    res.send(result);

  } catch(error){
    console.error(error);
    res.send('error');
  }
});


// 상품 게시글 수정
router.post('/product/edit/:id', isLoggedInAndBlocked, async(req, res) => {
  let { id } = req.params;
  const {category_id, product_name, condition, description, price, writer, publisher, publish_date, isbn10, isbn13} = req.body.data;

  let sql = "UPDATE product SET category_id = ?, product_name = ?, `condition` = ?, description = ?, price = ?, writer = ?, publisher = ?, publish_date = ?, isbn10 = ?, isbn13 = ? WHERE id = ?";
  const query = mysql.format(sql, [category_id, product_name, condition, description, price, writer, publisher, publish_date, isbn10, isbn13, id]);

  try {
    let result = await pool.query(query);
    //console.log("수정 결과: ", result)
  
    res.send(result);

  } catch (error) {
    console.error(error);
    res.send('error');
  }
});


// 사진 업로드 위한 패키지 require
const path = require('path')
const multer = require('multer')
const uuid4 = require('uuid4')
const { count } = require('console');

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
      done(null, path.join(__dirname, "../../client/public/img/product"));
    },
  }),
  limits: { fileSize: 1024 * 1024 },
});

// 파일 업로드
router.post('/product/file/upload', isLoggedInAndBlocked, upload.array('files', 5), async(req, res)=>{
  let sql = 'INSERT INTO product_image (product_id, boardNo, filename) VALUES (?, ?, ?)';
  const files = req.files
  let result

  try {
    files.forEach(async (el, i)=>{
      const query = mysql.format(sql, [req.body.productId, i, el.filename]);
      result = await pool.query(query); 
    })
  
    res.send(result);
  } catch (error) {
    console.log('productupload POST 과정에서 오류 발생 : ', error)
  }
})

// 파일 수정
router.post('/product/file/update', isLoggedInAndBlocked, upload.array('files', 5), async(req, res)=>{
  let sql = 'INSERT INTO product_image (product_id, boardNo, filename) VALUES (?, ?, ?)';
  let sql2 = 'DELETE FROM product_image WHERE id = ?'
  let sql3 = 'DELETE FROM product_image WHERE product_id = ?'
  let sql4 = "UPDATE product_image SET boardNo = ? WHERE id = ?";
  let result
  const files = req.files
  const {editProductId, prevFiles, delFiles} = req.body
  // 기존 파일들 데이터 받아옴
  const prevArray = JSON.parse(prevFiles)
  const delArray = JSON.parse(delFiles)
  const query = mysql.format(sql3, [editProductId]);

  try {
    if(prevArray.length == 0){ // prevArray.length가 0이면 기존 파일이 모두 지워졌다는 뜻
      // 해당 게시글의 사진 전부 지우기
      await pool.query(query)

      // 실제 파일들 지우기
      delArray.forEach((el)=>{
        fs.unlink(`./client/public/img/product/${el.filename}`, (err)=>{})
      })


      // 새로운 파일 DB에 저장
      files.forEach(async (el, i)=>{
        const query2 = mysql.format(sql, [editProductId, i, el.filename]);
        result = await pool.query(query2); 
      })
    } else { // 기존 파일이 남아있을 때 진입
      // 해당 게시글의 파일 DB 지우기
      delArray.forEach(async (el, i)=>{
        // console.log("삭제하는 사진의 id: ", el.id)
        const query3 = mysql.format(sql2, [el.id]);
        const result = await pool.query(query3)
      })
      
      // 기존 파일 boardNo 업데이트
      prevArray.forEach(async (el, i)=>{
        // console.log(el.id, "의 boardNo를 ", i, "로 변경")
        const query4 = mysql.format(sql4, [i, el.id]);
        await pool.query(query4);
      })

      // 실제 파일들 지우기
      delArray.forEach((el)=>{
        fs.unlink(`./client/public/img/product/${el.filename}`, (err)=>{})
      })
      
      // 새로운 파일 DB에 저장
      files.forEach(async (el, i)=>{
        const query5 = mysql.format(sql, [editProductId, i + prevArray.length, el.filename]);
        result = await pool.query(query5); 
      })
    }
  
    res.send(result);
  } catch (error) {
    console.log('fileupload UPDATE 과정에서 오류 발생 : ', error)
  }
})








module.exports = router;