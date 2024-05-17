import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container.js';
import { getUserProductList } from '../../api/user.js';

function OtherProduct(id) {

    const [otherProductList, setOtherProductList] = useState([]); // 상품목록

    const order = { // 정렬기준
        name : 'createdAt', 
        ascend : false
    }; 
    const filter = { // 필터링 없음
        sold : null,
        category_id : 0
    };

    // 상품 목록 가져오기
    async function getOtherProducts() {
        const res = await getUserProductList(id, 5, 0, order, filter);
        setOtherProductList(res);
    }

    useEffect(()=>{ // 시작점과 정렬 순서, 필터링이 바뀌면 재 랜더링
        getOtherProducts();
    }, [id]);
    
    // 로딩 및 데이터가 없을 때 박스 css
    const databox_css = (!otherProductList || otherProductList.length == 0) ?
    `${styles.sold} ${styles.box} d-flex justify-content-center`
    : `${styles.sold} ${styles.box} d-flex justify-content-around row-cols-5 flex-wrap`;

    return(
        <Container className={styles.section_sub_box}>
            <div className='inner'>
                <div className={styles.title}>
                    <h4 className={styles.title_font}>판매목록</h4>
                </div>
                <div className={databox_css}>
                    {
                        (otherProductList && otherProductList.length > 0) ?
                        otherProductList.map((el, i) => {
                            return(
                                <SoldBook key={i} product={el}/>
                            )
                        })
                        : <p>추가로 등록한 상품이 없어요!</p>
                    }
                    
                </div>
            </div>
        </Container>
    )
}

// 판매 상품 목록
function SoldBook({product}) {

    return(
        <div className={`${styles.book_card} d-flex flex-column`}>
            <Link to={`/productDetail/${product.id}`}>
                <div className={styles.book_image_box}>
                    {
                        product.filename ? 
                        <img className={styles.book_image} src={process.env.PUBLIC_URL + '/img/product/' + product.filename} alt='책사진'/>
                        :
                        <img className={styles.no_book_image} src={process.env.PUBLIC_URL + '/img/default/no_book_image.png'} alt='책사진'/>
                    }
                </div>
                <div className={styles.book_info}>
                    <div className={`${styles.book_title} d-flex justify-content-center align-items-center`}>
                    <span className={styles.text_hidden}>{product.product_name}</span>
                    </div>
                    <p className={`${styles.price}`}>&#8361; {product.price.toLocaleString()}</p>
                </div>
            </Link>
        </div>
    )
}

export default OtherProduct;