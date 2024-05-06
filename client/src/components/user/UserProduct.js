import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useHref, useNavigate, useSearchParams } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container.js';
import { Button } from 'react-bootstrap';
import { getUserProductList, getUserProductAll } from '../../api/user.js';
import { getCategory } from '../../api/product.js';
import TargetUserContext from '../../contexts/TargetUserContext.js';
import LoadingSpinner from '../LoadingSpinner.js';
import DataPagination from './DataPagination.js';
import Filtering from './Filtering.js';
import ProductSorting from './ProductSorting.js';

function UserProduct() {

    const currentUrl = window.location.href; // 현재 url
    const isProductUrl = currentUrl.includes("product"); // 상품 목록 페이지 여부
    const url = useHref(); // 현재 경로 가져오기

    const targetUserId = useContext(TargetUserContext); // 대상 id
    
    const [productList, setProductList] = useState([]); // 상품목록
    const [searchParams, setSearchParams] = useSearchParams(); // page query
    const [loading, setLoading] = useState(true); // 데이터 로딩 처리
    const [offset, setOffset] =  useState(0); // 데이터 가져오는 시작점
    const [totalData, setTotalData] = useState(0); // 전체 데이터 수
    const [order, setOrder] = useState({ name : 'createdAt', ascend : false }); // 정렬기준
    const [prevOrder, setPrevOrder] = useState({ name : 'createdAt', ascend : false }); // 이전 정렬기준
    const [category, setCategory] = useState([]); // 상품 카테고리
    const [filter, setFilter] = useState({ sold : false, category_id : 0});
    const [currentCategory, setCurrentCategory] = useState(-1); // 현재 선택된 카테고리
    let limit = 10;

    // 더보기버튼 클릭 시 이동
    const navigate = useNavigate();

    // 기본 페이지 - 5개만 출력
    async function getProductList() {
        let res;
        if (!isProductUrl) { // 사용자 페이지라면 간략한 정보
            res = await getUserProductList(targetUserId, 5, 0, order, filter);
        } else { // 더보기 후 상세 페이지라면 상세 정보
            if (prevOrder.name !== order.name || prevOrder.ascend !== order.ascend) {
                setOffset(0);
            }
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
        getCategoryList();
    }, []);

    useEffect(()=>{
        async function getTotal() {
            const res = await getUserProductAll(targetUserId);
            setTotalData(res);
        }

        async function pageOffset() {
            if (!searchParams.get("page") 
            || searchParams.get("page") < 0 
            || searchParams.get("page") > Math.max(Math.ceil(totalData/limit), 1) ) 
            {
                setOffset(0);
            } else {
                setOffset((searchParams.get("page")-1)*limit);
            }
        }

        getTotal();
        pageOffset();
    }, [totalData, searchParams])

    useEffect(()=>{ // 요청 url이 바뀔때마다 상품 정보를 다시 가져옴
        setLoading(true);
        getProductList();

    }, [offset, order]);

    function handleMoreView() { // 판매목록 리스트로 이동
        if (!isProductUrl) {
            navigate(`/user/${targetUserId}/product?page=1`);
        }
    }

    function handleMoveBack() { // 이전 페이지 - 유저정보
        if (isProductUrl) {
            navigate(`/user/${targetUserId}`);
        }
    }

    function handlePagination(pageNumber) { // pagination에서 offset 변경
        setOffset((pageNumber-1)*limit);
        setSearchParams(pageNumber);
    }

    function handleOrder(e) { // 정렬 처리
        let order_id = e.currentTarget.id;
        setPrevOrder((prevOrder)=>({...prevOrder, name : order.name, ascend : order.ascend }));
        setOrder((order)=>({...order, name : order_id, ascend : !order.ascend}));
        //navigate(`${url}?page=1`); // 정렬 바뀌면 무조건 1페이지로 이동
        console.log({...order})
    }

    function handleChange(event, index, category_id) { // 카테고리 선택 수정
        if (!index && !category_id) {
            setFilter((filter)=>({...filter, sold : !filter.sold}));
        } else {
            if (event.target.checked) {
                setFilter((filter)=>({...filter, category_id : category_id}));
                setCurrentCategory(index);
            }
        }
    }

    function handleFilter(targetIdName) { // 필터 적용
        if (targetIdName === 'reset_filter') {
            setFilter((filter)=>({...filter, sold : false, category_id : 0}));
            setCurrentCategory(-1);
        }
        getProductList();
    }

    // 로딩 및 데이터가 없을 때 박스 css
    const databox_css = (!productList || productList.length == 0) ?
    `${styles.sold} ${styles.box} d-flex justify-content-center`
    : `${styles.sold} ${styles.box} d-flex justify-content-around row-cols-5 flex-wrap`;

    // 로딩 상태일 때 출력
    if (loading) {
        return (
            <Container className={styles.section_sub_box}>
                <div className='inner'>
                    <div className={styles.title}>
                        <h4 className={styles.title_font}>판매목록</h4>
                    </div>
                    <div className={databox_css}>
                        <LoadingSpinner/>
                    </div>
                </div>
            </Container>
        )
    } 

    // 일반 출력
    return(
        <Container className={styles.section_sub_box}>
            <div className='inner'>
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
                            <div>
                                <ProductSorting 
                                sortType={'product_name'} ascend={order.name === 'product_name' && order.ascend} 
                                handleOrder={handleOrder}/>
                                <ProductSorting 
                                sortType={'price'} ascend={order.name === 'price' && order.ascend} 
                                handleOrder={handleOrder}/>
                                <Filtering category={category} handleFilter={handleFilter}
                                filter={filter} setFilter={setFilter}
                                currentCategory={currentCategory}
                                handleChange={handleChange}/>
                            </div> 
                            : null
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
                            totalData={totalData} 
                            limit={limit} blockPerPage={3}
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

// 판매 상품 목록
function SoldBook({product}) {

    return(
        <div className={`${styles.book_card} d-flex flex-column`}>
            <Link to="#">
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

export default UserProduct;