import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container.js';
import { Button } from 'react-bootstrap';
import { getUserProductList, getUserProductAll } from '../../api/user.js';
import TargetUserContext from '../../contexts/TargetUserContext.js';
import LoadingSpinner from '../LoadingSpinner.js';
import DataPagination from './DataPagination.js';

function UserProduct() {

    const targetUserId = useContext(TargetUserContext); // 대상 id
    
    const [productList, setProductList] = useState([]); // 상품목록
    const [currentUrl, setCurrentUrl] = useState(window.location.href); // 현재 url
    const [isProductUrl, setIsProductUrl] = useState(currentUrl.includes("product")); // 상품url 포함여부
    const [loading, setLoading] = useState(true); // 데이터 로딩 처리
    const [offset, setOffset] =  useState(0); // 데이터 가져오는 시작점
    const [totalData, setTotalData] = useState(0); // 전체 데이터 수
    let limit = 10;

    // 더보기버튼 클릭 시 이동
    const navigate = useNavigate();

    function handleMoreView() { // 판매목록 리스트로 이동
        if (!isProductUrl) {
            navigate(`/user/${targetUserId}/product`);
        }
    }

    function handleMoveBack() { // 이전 페이지 - 유저정보
        if (isProductUrl) {
            navigate(`/user/${targetUserId}`);
        }
    }

    function handlePagination(value) { // pagination에서 offset 변경
        setOffset((value-1)*limit);
    }

    useEffect(()=>{ // 요청 url 확인
        setIsProductUrl(currentUrl.includes("product"));
    }, [currentUrl, isProductUrl]);

    useEffect(()=>{ // 요청 url이 바뀔때마다 리뷰 정보를 다시 가져옴
        setLoading(true);

        // 기본 페이지 - 5개만 출력
        async function getProductList() {
            let res;
            if (!isProductUrl) { // 사용자 페이지라면 간략한 정보
                res = await getUserProductList(targetUserId, 5, 0);
            } else { // 더보기 후 상세 페이지라면 상세 정보
                res = await getUserProductList(targetUserId, limit, offset);
            }
            setProductList(res);
            setLoading(false);
        }

        async function getTotal() {
            const res = await getUserProductAll(targetUserId);
            setTotalData(res);
        }

        getProductList();
        getTotal();
    }, [targetUserId, currentUrl, isProductUrl, offset]);

    // 더보기 버튼 유무에 따른 타이틀 css
    const titlebox_css = (isProductUrl || !productList || productList.length == 0) ?
    `${styles.title} ${styles.review_title_box}` 
    : `${styles.title}`;

    // 로딩 및 데이터가 없을 때 박스 css
    const databox_css = (!productList || productList.length == 0) ?
    `${styles.sold} ${styles.box} d-flex justify-content-center`
    : `${styles.sold} ${styles.box} d-flex justify-content-around row-cols-5 flex-wrap`;

    if (loading) {
        return (
            <Container className={styles.section_sub_box}>
                <div className='inner'>
                    <div className={`${styles.title} ${styles.review_title_box}`}>
                        <h4>판매목록</h4>
                    </div>
                    <div className={databox_css}>
                        <LoadingSpinner/>
                    </div>
                </div>
            </Container>
        )
    } 

    return(
        <Container className={styles.section_sub_box}>
            <div className='inner'>
                    <div className={`${titlebox_css} d-flex justify-content-between`}>
                        <h4>판매목록</h4>
                        {
                            (isProductUrl || !productList || productList.length == 0) ? 
                            null
                            : <Button 
                            variant='outline-primary' 
                            className={styles.more_btn}
                            onClick={handleMoreView}
                            >더보기</Button>
                        }
                    </div>
                    <div className={databox_css}>
                        {
                            (productList && productList.length > 0) ?
                            productList.map((el, i) => {
                                return(
                                    <SoldBook key={i} product={el}/>
                                )
                            })
                            : <p>아직 등록한 상품이 없어요!</p>
                        }
                        
                    </div>
                    {
                        isProductUrl ?
                        <div className={styles.pagination_wrap}>
                            <DataPagination 
                            totalData={totalData} limit={limit} blockPerPage={3}
                            handlePagination={handlePagination}
                            />
                            <Button variant='secondary'
                            className={`${styles.back_btn}`}
                            onClick={handleMoveBack}
                            >뒤로가기</Button>
                        </div>
                        : null
                    }
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