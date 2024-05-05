import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container.js';
import { Button, Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ArrowDown, ArrowUp, CurrencyDollar, Filter } from 'react-bootstrap-icons';
import { getUserProductList, getUserProductAll } from '../../api/user.js';
import { getCategory } from '../../api/product.js';
import TargetUserContext from '../../contexts/TargetUserContext.js';
import LoadingSpinner from '../LoadingSpinner.js';
import DataPagination from './DataPagination.js';

function UserProduct() {

    const currentUrl = window.location.href; // 현재 url
    const isProductUrl = currentUrl.includes("product"); // 상품 목록 페이지 여부

    const targetUserId = useContext(TargetUserContext); // 대상 id
    
    const [productList, setProductList] = useState([]); // 상품목록
    const [searchParams, setSearchParams] = useSearchParams(); // page query
    const [loading, setLoading] = useState(true); // 데이터 로딩 처리
    const [offset, setOffset] =  useState(0); // 데이터 가져오는 시작점
    const [totalData, setTotalData] = useState(0); // 전체 데이터 수
    const [order, setOrder] = useState({ name : 'createdAt', ascend : false }); // 정렬기준
    const [prevOrder, setPrevOrder] = useState({ name : 'createdAt', ascend : false }); // 이전 정렬기준
    const [category, setCategory] = useState([]); // 상품 카테고리
    const [showFilter, setShowFilter] = useState(false); // 필터목록 표시여부
    let limit = 10;

    // 더보기버튼 클릭 시 이동
    const navigate = useNavigate();

    const target = useREf(null); // 필터 타겟

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

        // 기본 페이지 - 5개만 출력
        async function getProductList() {
            let res;
            if (!isProductUrl) { // 사용자 페이지라면 간략한 정보
                res = await getUserProductList(targetUserId, 5, 0, order);
            } else { // 더보기 후 상세 페이지라면 상세 정보
                if (prevOrder.name === order.name && prevOrder.ascend === order.ascend) {
                    res = await getUserProductList(targetUserId, limit, offset, order);
                } else {
                    setOffset(0);
                    res = await getUserProductList(targetUserId, limit, offset, order);
                }
            }
            setProductList(res);
            setLoading(false);
        }
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
        //navigate(`${url}?page=${pageNumber}`); // 정렬 바뀌면 무조건 1페이지로 이동
        console.log({...order})
    }

    // 로딩 및 데이터가 없을 때 박스 css
    const databox_css = (!productList || productList.length == 0) ?
    `${styles.sold} ${styles.box} d-flex justify-content-center`
    : `${styles.sold} ${styles.box} d-flex justify-content-around row-cols-5 flex-wrap`;

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
                                <Sorting 
                                sortType={'product_name'} ascend={order.name === 'product_name' && order.ascend} 
                                handleOrder={handleOrder}/>
                                <Sorting 
                                sortType={'price'} ascend={order.name === 'price' && order.ascend} 
                                handleOrder={handleOrder}/>
                                <Filtering 
                                target={target} 
                                showFilter={showFilter} setShowFilter={setShowFilter} 
                                category={category}
                                />
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

function Sorting({sortType, ascend, handleOrder}) {

    let tooltipName;
    let sortIcon;
    switch (tooltipName) {
        case 'createdAt' :
            tooltipName = '등록날짜';
            sortIcon = <span className={styles.sortType_name}>가</span>;
            break;
        case 'price' :
            tooltipName = '가격';
            sortIcon = <CurrencyDollar/>;
            break;
        case 'product_name' :
            tooltipName = '이름';
            sortIcon = <Clock/>;
            break;
    }

    return(
        <OverlayTrigger
        placement='top'
        overlay={
            <Tooltip>{tooltipName} {ascend ? '오름차순' : '내림차순'}</Tooltip>
        }
        >
            <span className={`${styles.sort_box}`} id={sortType} onClick={(e)=>{handleOrder(e)}}>
                {ascend ? <ArrowUp/> : <ArrowDown/>}
                {sortIcon}
            </span>
        </OverlayTrigger>
    )
}

function Filtering({target, showFilter, setShowFilter, category}) {
    
    return(
        <>
            <Button ref={target} onClick={()=>{setShowFilter(!showFilter)}}><Filter/></Button>
            <Overlay target={target.current} show={show} placement='top'>
                <div>
                    <div>
                        <input type='checkbox' id='sold'></input>
                        <label for='sold'>판매된 상품 제외</label>
                    </div>
                    <hr/>
                    <div>
                        {
                            category.map((el)=>{
                                return(
                                    <div key={el.id}>
                                        <input type='checkbox' id={el.category_name}></input>  
                                        <label for={el.category_name}>{el.category_name}</label>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </Overlay>
        </>
    )
}

function SoldBook({product}) {

    return(
        <div className={`${styles.book_card} d-flex flex-column`}>
            <Link to="#">
                <div className={`${styles.book_image_box}`}>
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