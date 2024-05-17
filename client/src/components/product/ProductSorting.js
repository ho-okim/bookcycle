import styles from "../../styles/productList.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useProductOption } from "../../contexts/ProductOptionContext";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

function ProductSorting() {

  const location = useLocation(); // location 객체
  const [searchParams, setSearchParams] = useSearchParams(); // 현재 page
  const {order, setOrder, filter, setFilter} = useProductOption();
  
  const navigate = useNavigate();

  let newUrl = '/product';
  if (location.search && !searchParams.get("page")) {
      newUrl += location.search;
  }

  function handleSort(e) { // 정렬 처리
    let name = (e.currentTarget.value).split(".")[0];
    let ascend = (e.currentTarget.value).split(".")[1] ?? 'DESC';

    setOrder((order)=>({...order, name : name, ascend : ascend}));

    // setOrder만으로도 잘 작동한다면 제거해도 됨
    navigate(newUrl,  { state : {order : {name : name, ascend : ascend}} });
  }

  function handleFilter(e) { // 필터 처리
    let condition = e.currentTarget.value ?? 'all';
    setFilter((filter)=>({...filter, condition : condition }));

    // setFilter만으로도 잘 작동한다면 제거해도 됨
    navigate(newUrl,  { state : {filter : {condition : condition}} });
  }

    return(
      <div className={styles.buttonList}>
        <select id="sort_condition" className={styles.condition_select}
        onChange={(e)=>{handleFilter(e)}}>
            <option value="all">상품상태</option>
            <option value="상">상</option>
            <option value="중">중</option>
            <option value="하">하</option>
        </select>
        <select id="sort_other" className={styles.order_select}
        onChange={(e)=>{handleSort(e)}}>
          <option value="createdAt">최신등록순</option>
          <option value="price.DESC">높은가격순</option>
          <option value="price.ASC">낮은가격순</option>
          <option value="liked">좋아요순</option>
          <option value="view_count">조회순</option>
        </select>
      </div> 
    )
}

export default ProductSorting;