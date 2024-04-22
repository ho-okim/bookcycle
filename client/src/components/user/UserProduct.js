import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useContext, useEffect } from 'react';
import Container from 'react-bootstrap/esm/Container.js';
import { Button } from 'react-bootstrap';
import { getUserProductList } from '../../api/user.js';
import TargetUserContext from '../../contexts/TargetUserContext.js';

function UserProduct() {

    const [productList, setProductList] = useState([]);
    const targetUserId = useContext(TargetUserContext);

    useEffect(()=>{
        // 특정 사용자의 판매목록 조회
        async function getProductList() {
            const res = await getUserProductList(targetUserId);
            setProductList(res);
        }
        getProductList();

    }, [targetUserId]);

    if (!productList || productList.length == 0) {
        return (
            <Container className={styles.section_sub_box}>
            <div className='inner'>
                <div>
                    <div className={`${styles.title} ${styles.review_title_box}`}>
                        <h4>판매목록</h4>
                    </div>
                    {/* api 조회 결과로 map 사용 예정? */}
                    <div className={
                        `${styles.sold} ${styles.box} d-flex justify-content-center`
                    }>
                        <p>아직 판매한 제품이 없어요!</p>
                    </div>
                </div>
            </div>
            </Container>
        )
    } 

    return(
        <Container className={styles.section_sub_box}>
            <div className='inner'>
                <div>
                    <div className={`${styles.title} d-flex justify-content-between`}>
                        <h4>판매목록</h4>
                        <Button variant='outline-primary' className={styles.more_btn}
                        >더보기</Button>
                    </div>
                    <div className={
                        `${styles.sold} ${styles.box} d-flex justify-content-around row-cols-6 flex-wrap`
                    }>
                        {
                            productList.map((el, i) => {
                                return(
                                    <SoldBook key={i} product={el}/>
                                )
                            })
                        }
                        
                    </div>
                </div>
            </div>
        </Container>
    )
}

function SoldBook({product}) {

    return(
        <div className={`${styles.book_card} d-flex flex-column`}>
            <div className={`${styles.book_image_box} ${styles.box}`}>
                <img className={styles.book_image} src='' alt='책사진'/>
            </div>
            <div className={styles.book_info}>
                <p className={`${styles.book_title} ${styles.box}`}>{product.product_name}</p>
                <p className={`${styles.price} ${styles.box}`}>&#8361; {product.price.toLocaleString()}</p>
            </div>
        </div>
    )
}

export default UserProduct;