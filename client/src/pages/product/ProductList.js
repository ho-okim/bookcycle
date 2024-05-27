import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../styles/productList.module.css";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import ProductBox from "../../components/product/ProductBox.js";
import ProductCategory from "../../components/product/ProductCategory.js";
import ProductSorting from "../../components/product/ProductSorting.js";
import ProductPagination from '../../components/product/ProductPagination.js';
import ProductOptionContext from '../../contexts/ProductOptionContext.js';
import LoadingSpinner from '../../components/LoadingSpinner.js';
import { useHref, useLocation, useSearchParams } from 'react-router-dom';
import { getProductAll, getProductList } from '../../api/product.js';
import ProductSearchInput from '../../components/product/ProductSearchInput.js';

function ProductList() {

  const [searchParams, setSearchParams] = useSearchParams(); // query string
  const url = useHref();
  const location = useLocation();

  const [loading, setLoading] = useState(false); // 데이터 로딩 처리
  const [productList, setProductList] = useState([]); // 상품목록
  const [offset, setOffset] =  useState(0); // 데이터 가져오는 시작점
  const [totalData, setTotalData] = useState(0); // 전체 데이터 수
  const [filter, setFilter] = useState({ // 필터
    category_id : location.state?.filter?.category_id ?? 0,
    condition : location.state?.filter?.condition ?? 'all'
  }); 
  const [order, setOrder] = useState({ // 정렬기준
    name : location.state?.order?.name ?? 'createdAt', 
    ascend : location.state?.order?.ascend ?? 'DESC' 
  });
  const [searchKeyword, setSearchKeyword] = useState({ // 검색
    type : searchParams.get("stype") ?? 'product_name', 
    keyword : searchParams.get("search") ?? ''
  });

  const limit = 15;

  useEffect(()=>{
    // 전체 상품 수 조회 - 페이징 처리 위함
    async function getTotal() { 
      const res = await getProductAll(filter, searchKeyword);
      setTotalData(res);
    }

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
  }, [totalData, searchParams, filter]);

  useEffect(()=>{ // 시작점과 정렬 순서, 필터링이 바뀌면 재 랜더링
    setLoading(true);

    // 상품 목록 가져오기
    async function getProducts() {
      let res;
      res = await getProductList(limit, offset, order, filter, searchKeyword);
      setProductList(res);
      setLoading(false);
    }

    getProducts();
  }, [offset, searchParams, order, filter, url]);

  function handlePagination(pageNumber) { // pagination에서 offset 변경
    setOffset((pageNumber-1)*limit);
  }

    return (
      <ProductOptionContext.Provider value={{order, setOrder, filter, setFilter, searchKeyword, setSearchKeyword}}>
        <Container>
          <div className='inner'>
              <div className={styles.top_box}>
                <div className={`${styles.top_inner_box} inner`}>
                  <div className={styles.option_box}>
                    <ProductSorting order={order} setOrder={setOrder}/>
                    <ProductSearchInput/>
                  </div>
                  <ProductCategory filter={filter} setFilter={setFilter}/>
                </div>
              </div>
              <div className={styles.productList}>
                {
                  loading ? 
                  <div className='blank_box'>
                    <p className='blank_message'>데이터를 불러오는 중입니다</p>
                    <LoadingSpinner/>
                  </div>
                  :
                  <div className={styles.product_box}>
                  {
                    (productList && productList.length > 0) ?
                    productList.map((el, i)=>{
                      return(
                        <ProductBox key={i} product={el}/>
                      )
                    })
                    :
                    <div className='blank_box'>
                      <p className='blank_message'>
                          검색된 상품이 없어요!
                      </p>
                    </div>
                  }
                  </div>
                }
              </div>
              <div className='d-flex justify-content-center'>
                <ProductPagination     
                totalData={totalData}
                limit={limit}
                blockPerPage={5}
                handlePagination={handlePagination}/>
              </div>
            </div>
        </Container>
      </ProductOptionContext.Provider>
    );
}

export default ProductList;