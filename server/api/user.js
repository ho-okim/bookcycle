const router = require('express').Router();
const pool = require("../db.js"); // db connection pool

// 특정 사용자 조회
router.get('/user/:userId', async (req, res) => {
    const {userId} = req.params;
    
    // query문 설정
    let sql = 'SELECT * FROM users WHERE id = ?';

    // db connection pool을 가져오고, query문 수행
    const result = await pool.query(sql, [userId]); // query문의 결과는 배열로 들어오기 때문에 주의해야 함

    const { nickname, profile_image, manner_score } = result[0];

    // client로 보낼 데이터
    const body = { userId, nickname, profile_image, manner_score };

    res.send(body);
});

// 특정 사용자의 판매목록 조회
router.get('/user/product/:userId', async (req, res) => {
    const {userId} = req.params;
    
    // query문
    let sql = 'SELECT * FROM product WHERE seller_id = ?';
    let sql_file = 'SELECT * FROM product_image_file WHERE product_id = ?';

    try {
        // 상품 목록 먼저 조회
        const product_result = await pool.query(sql, [userId]);

        // client로 보낼 데이터 (상품 목록 + 이미지 리스트)
        const body = await Promise.all(
            product_result.map(async (el) => {
    
                let product_id = el.id;
                let product_name = el.product_name;
                let price = el.price;
    
                const image_result = await pool.query(sql_file, [product_id]);
    
                return({
                    "product_id" : product_id, 
                    "product_name" : product_name, 
                    "price" : price, 
                    "image_list" : image_result
                });
    
            })
        )
    
        res.send(body);
    } catch (error) {
        console.error("상품 목록 조회 실패");
        res.status(500).send("internal server error");
    }

});

// 특정 판매자의 상품에 대한 review 조회
router.get('/user/review/:userId', async (req, res) => {
    const {userId} = req.params;
    
    // query문 설정
    let sql = 'SELECT * FROM user_review WHERE seller_id = ?';

    // db connection pool을 가져오고, query문 수행
    const result = await pool.query(sql, [userId]); // query문의 결과는 배열로 들어오기 때문에 주의해야 함

    res.send(result);
});

// 특정 판매자에 대한 review와 review tag 조회
router.get('/user/reviewtag/:userId', async (req, res) => {
    const {userId} = req.params;
    
    // query문 설정
    let sql = 'SELECT *, count(*) AS size FROM review_tag_list WHERE seller_id = ? GROUP BY tag_id';

    // db connection pool을 가져오고, query문 수행
    const result = await pool.query(sql, [userId]); // query문의 결과는 배열로 들어오기 때문에 주의해야 함

    res.send(result);
});

module.exports = router;