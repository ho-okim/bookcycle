import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { getUserProductList, getUserProductAll } from '../../api/user.js';
import { getCategory } from '../../api/product.js';
import { useTargetUser } from '../../contexts/TargetUserContext.js';
import UserProductContext from '../../contexts/UserProductContext.js';
import LoadingSpinner from '../LoadingSpinner.js';
import DataPagination from './DataPagination.js';
import UserProductFiltering from './UserProductFiltering.js';
import UserProductSorting from './UserProductSorting.js';

function UserProduct() {

    const currentUrl = window.location.href; // 현재 url
    const isProductUrl = currentUrl.includes("product"); // 상품 목록 페이지 여부
    const location = useLocation(); // location 객체

    const { targetUserId, userInfo } = useTargetUser(); // 대상 id
    
    const [productList, setProductList] = useState([]); // 상품목록
    const [searchParams, setSearchParams] = useSearchParams(); // page query
    const [loading, setLoading] = useState(true); // 데이터 로딩 처리
    const [offset, setOffset] =  useState(0); // 데이터 가져오는 시작점
    const [totalData, setTotalData] = useState(0); // 전체 데이터 수
    const [category, setCategory] = useState([]); // 상품 카테고리
    const [order, setOrder] = useState({ // 정렬기준
        name : location.state?.order?.name ?? 'createdAt', 
        ascend : location.state?.order?.ascend ?? false 
    }); 
    const [filter, setFilter] = useState({ // 필터링
        sold : location.state?.filter?.sold ?? null, 
        category_id : location.state?.filter?.category_id ?? 0
    });
    
    let limit = 10;
    let showLimit = 5;

    // 메모로 state 최적화?
    const productOption = useMemo(()=>({
        order, setOrder, filter, setFilter, offset, setOffset, category, setCategory
    }), [order, setOrder, filter, setFilter, offset, setOffset, category, setCategory]);

    // 더보기버튼 클릭 시 이동
    const navigate = useNavigate();

    // 전체 상품 수 조회 - 페이징 처리 위함
    async function getTotal() { 
        const res = await getUserProductAll(targetUserId, filter);
        setTotalData(res);
    }

    // 상품 목록 가져오기
    async function getProductList() {
        let res;
        if (!isProductUrl) { // 사용자 페이지라면 간략한 정보
            res = await getUserProductList(targetUserId, showLimit, 0, order, filter);
        } else { // 더보기 후 상세 페이지라면 상세 정보
            res = await getUserProductList(targetUserId, limit, offset, order, filter);
        }
        setProductList(res);
        setLoading(false);
    }

    useEffect(()=>{
        async function getCategoryList() { // 최초 렌더링 시 카테고리 가져오기
            const res = await getCategory();
            setCategory(res);
        }

        if (userInfo.blocked === 0) { // 차단되지 않은 사용자일때만 호출
            getCategoryList();
        }
    }, [userInfo]);

    useEffect(()=>{
        async function pageOffset() { // 페이지 시작점 처리
            if (!searchParams.get("page") 
            || searchParams.get("page") < 0 
            || searchParams.get("page") > Math.max(Math.ceil(totalData/limit), 1) ) 
            {
                setOffset(0);
            } else {
                setOffset((searchParams.get("page")-1)*limit);
            }
        }

        if (userInfo.blocked === 0) { // 차단되지 않은 사용자일때만 호출
            getTotal();
            pageOffset();
        }
    }, [totalData, searchParams, location.state, userInfo]);

    useEffect(()=>{ // 시작점과 정렬 순서, 필터링이 바뀌면 재 랜더링
        if (userInfo.blocked === 0) { // 차단되지 않은 사용자일때만 호출
            setLoading(true);
            getProductList();
        }
    }, [targetUserId, offset, order, location.state, userInfo]);
    
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

    function handlePagination(pageNumber) { // pagination에서 offset 변경
        setOffset((pageNumber-1)*limit);
    }

    // 로딩 및 데이터가 없을 때 박스 css
    const databox_css = (!productList || productList.length === 0) ?
    `d-flex justify-content-center`
    : `${styles.book_list_box}`;

    return(
    <UserProductContext.Provider value={productOption}>
        <section className={styles.section_box}>
            <Container>
                <div className={styles.title}>
                    <h4 className={styles.title_font}>판매목록</h4>
                    {
                        (isProductUrl || !productList || productList.length == 0) ? 
                        null
                        : <Button 
                        variant='outline-primary' 
                        className={styles.more_btn}
                        onClick={handleMoreView}
                        >더보기</Button>
                    }
                    {
                        (isProductUrl) ? 
                        <div className='d-flex justify-content-end align-items-center flex-wrap'>
                            <UserProductSorting
                            sortType={'product_name'} 
                            typeAscend={order.name === 'product_name' && order.ascend}/>
                            <UserProductSorting
                            sortType={'price'} 
                            typeAscend={order.name === 'price' && order.ascend} />
                            <UserProductSorting
                            sortType={'createdAt'} 
                            typeAscend={order.name === 'createdAt' && order.ascend}/>
                            <UserProductFiltering category={category}/>
                        </div>
                        : null
                    }
                </div>
                {
                    (loading) ?
                    <div className={databox_css}>
                        <LoadingSpinner/>
                    </div>
                    : null
                }
                <div className={databox_css}>
                    {
                        (productList && productList.length > 0) ?
                        productList.map((el, i) => {
                            return(
                                <BookForSale key={i} product={el}/>
                            )
                        })
                        : 
                        <div className='blank_box p-0 m-0'>
                            <p className='blank_message'>아직 등록한 상품이 없어요!</p>
                        </div>
                    }
                    
                </div>
                {
                    isProductUrl ?
                    <>
                    <div className={styles.pagination_wrap}>
                        <DataPagination
                        totalData={totalData} 
                        limit={limit} blockPerPage={3}
                        handlePagination={handlePagination}/>
                    </div>
                    <div className={styles.back_wrap}>
                        <Button variant='outline-secondary'
                        className={styles.back_btn}
                        onClick={handleMoveBack}
                        >사용자 페이지로 돌아가기</Button>
                    </div>
                    </>
                    : null
                }
            </Container>
        </section>
    </UserProductContext.Provider>
    )
}

// 판매 상품 목록
function BookForSale({product}) {

    return(
        <div className={`${styles.book_box} d-flex flex-column`}>
            <Link to={`/product/detail/${product.id}`}>
                <div className={styles.book_image_box}>
                    {
                        product.filename ? 
                        <img className={styles.book_image} src={process.env.PUBLIC_URL + '/img/product/' + product.filename} alt='책사진'/>
                        :
                        <img className={styles.book_image} src={process.env.PUBLIC_URL + '/img/default/no_book_image.png'} alt='책사진'/>
                    }
                </div>
                <div className={styles.book_info}>
                    <p className={`${styles.text_hidden} text-center`}>{product.product_name}</p>
                    <p className={styles.price}>{product.price.toLocaleString()} 원</p>
                </div>
            </Link>
        </div>
    )
}

export default UserProduct;