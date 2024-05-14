import styles from "../../styles/productList.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useProductOption } from "../../contexts/ProductOptionContext";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

function ProductSorting() {

  const {order, setOrder, filter, setFilter} = useProductOption();

  const navigate = useNavigate();

  function handleSort(e) { // 정렬 처리
    let name = (e.currentTarget.value).split(".")[0];
    let ascend = (e.currentTarget.value).split(".")[1] ?? 'DESC';

    setOrder((order)=>({...order, name : name, ascend : ascend}));
    navigate(`/productList?category_id=${filter.category_id}&condition=${filter.condition}&order=${name}&ascend=${ascend}`);
  }

  function handleFilter(e) { // 필터 처리
    let condition = e.currentTarget.value ?? 'all';
    setFilter((filter)=>({...filter, condition : condition }));
    navigate(`/productList?category_id=${filter.category_id}&condition=${condition}&order=${order.name}&ascend=${order.ascend}`);
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