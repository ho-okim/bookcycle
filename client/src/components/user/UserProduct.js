import styles from '../../styles/user.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useContext, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container.js';
import { Button } from 'react-bootstrap';
import { getUserProductList, getUserProductAll } from '../../api/user.js';
import { getCategory } from '../../api/product.js';
import TargetUserContext from '../../contexts/TargetUserContext.js';
import UserProductContext from '../../contexts/UserProductContext.js';
import LoadingSpinner from '../LoadingSpinner.js';
import DataPagination from './DataPagination.js';
import Filtering from './Filtering.js';
import ProductSorting from './ProductSorting.js';


function UserProduct() {

    const currentUrl = window.location.href; // 현재 url
    const isProductUrl = currentUrl.includes("product"); // 상품 목록 페이지 여부

    const {targetUserId} = useContext(TargetUserContext); // 대상 id
    
    const [productList, setProductList] = useState([]); // 상품목록
    const [searchParams, setSearchParams] = useSearchParams(); // page query
    const [loading, setLoading] = useState(true); // 데이터 로딩 처리
    const [offset, setOffset] =  useState(0); // 데이터 가져오는 시작점
    const [totalData, setTotalData] = useState(0); // 전체 데이터 수
    const [category, setCategory] = useState([]); // 상품 카테고리
    const [order, setOrder] = useState({ // 정렬기준
        name : searchParams.get("order") ?? 'createdAt', 
        ascend : searchParams.get("ascend") ?? false 
    }); 
    const [filter, setFilter] = useState({ // 필터링
        sold : (!searchParams.get("sold") || searchParams.get("sold") === 'null') ? null : searchParams.get("sold"), 
        category_id : searchParams.get("category_id") ?? 0
    });
    
    let limit = 5;

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
            res = await getUserProductList(targetUserId, 5, 0, order, filter);
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
        getCategoryList();
    }, []);

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

        getTotal();
        pageOffset();
    }, [totalData, searchParams]);

    useEffect(()=>{ // 시작점과 정렬 순서, 필터링이 바뀌면 재 랜더링
        setLoading(true);
        getProductList();
    }, [targetUserId, offset, searchParams]);
    
    function handleMoreView() { // 판매목록 리스트로 이동
        if (!isProductUrl) {
            navigate(`/user/${targetUserId}/product?category_id=0&page=1`);
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

    function handleOptionClick() { // 필터, 정렬 적용
        navigate(`/user/${targetUserId}/product?sold=${filter.sold}&category_id=${filter.category_id}&order=${order.name}&ascend=${order.ascend}`);
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
    <UserProductContext.Provider value={productOption}>
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
                            <div className={styles.option_box}>
                                <ProductSorting
                                sortType={'product_name'} 
                                typeAscend={order.name === 'product_name' && order.ascend}
                                handleOptionClick={handleOptionClick}/>
                                <ProductSorting
                                sortType={'price'} 
                                typeAscend={order.name === 'price' && order.ascend} 
                                handleOptionClick={handleOptionClick}/>
                                <ProductSorting
                                sortType={'createdAt'} 
                                typeAscend={order.name === 'createdAt' && order.ascend}
                                handleOptionClick={handleOptionClick}/>
                                <Filtering category={category} 
                                handleOptionClick={handleOptionClick}
                                searchParams={searchParams}/>
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
                            order={order}
                            filter={filter}
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
    </UserProductContext.Provider>
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