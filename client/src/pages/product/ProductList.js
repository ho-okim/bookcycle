import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../styles/productList.module.css";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import List from "../../components/product/List.js";
import ProductCategory from "../../components/product/ProductCategory.js";
import ProductSorting from "../../components/product/ProductSorting.js";
import ProductPagination from '../../components/product/ProductPagination.js';
import ProductOptionContext from '../../contexts/ProductOptionContext.js';
import LoadingSpinner from '../../components/LoadingSpinner.js';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getProductAll, getProductList } from '../../api/product.js';

function ProductList() {

  const [loading, setLoading] = useState(false); // 데이터 로딩 처리
  const [searchParams, setSearchParams] = useSearchParams();
  const [productList, setProductList] = useState([]); // 상품목록
  const [offset, setOffset] =  useState(0); // 데이터 가져오는 시작점
  const [totalData, setTotalData] = useState(0); // 전체 데이터 수
  const [filter, setFilter] = useState({ // 필터
    category_id : searchParams.get("category_id") ?? 0,
    condition : searchParams.get("condition") ?? 'all'
  }); 
  const [order, setOrder] = useState({ // 정렬기준
    name : searchParams.get("order") ?? 'createdAt', 
    ascend : searchParams.get("ascend") ?? 'DESC' 
  });

  const limit = 10;

  const navigate = useNavigate();

    // 전체 상품 수 조회 - 페이징 처리 위함
    async function getTotal() { 
      const res = await getProductAll(filter);
      setTotalData(res);
  }

  // 상품 목록 가져오기
  async function getProducts() {
      let res;
      res = await getProductList(limit, offset, order, filter);
      setProductList(res);
      setLoading(false);
  }

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
      getProducts();
  }, [offset, searchParams, order, filter]);

  function handlePagination(pageNumber) { // pagination에서 offset 변경
      setOffset((pageNumber-1)*limit);
  }

    return (
      <ProductOptionContext.Provider value={{order, setOrder, filter, setFilter}}>
        <Container>
          <div className={`${styles.list_box} inner`}>
              <ProductCategory filter={filter} setFilter={setFilter}/>
              <div className={styles.productList}>
                <div className={styles.option_box}>
                  <ProductPagination     
                  totalData={totalData}
                  limit={limit}
                  blockPerPage={5}
                  handlePagination={handlePagination}/>
                  <ProductSorting order={order} setOrder={setOrder}/>
                </div>
                {
                  loading ? 
                  <div className={styles.loading_box}>
                    <p>데이터를 불러오는 중입니다</p>
                    <LoadingSpinner/>
                  </div>
                  :
                  <div className={styles.product_box}>
                  {
                    productList.map((el, i)=>{
                      return(
                        <List key={i} product={el}/>
                      )
                    })
                  }
                  </div>
                }
              </div>
            </div>
        </Container>
      </ProductOptionContext.Provider>
    );
}

export default ProductList;