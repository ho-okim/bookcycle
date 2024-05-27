import styles from "../../styles/productList.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from "react-bootstrap";
import { useProductOption } from "../../contexts/ProductOptionContext";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

function ProductSorting() {

  const location = useLocation(); // location 객체
  const [searchParams, setSearchParams] = useSearchParams(); // 현재 page
  const {setOrder, setFilter} = useProductOption();

  const [filterName, setFilterName] = useState('상품상태'); // 정렬 드롭다운 이름
  const [optionName, setOptionName] = useState('정렬기준'); // 정렬 드롭다운 이름
  
  const navigate = useNavigate();

  let newUrl = '/product';
  if (location.search && !searchParams.get("page")) {
      newUrl += location.search;
  }

  function handleFilter(eventKey, event) { // 필터 처리
    event.persist();
    let condition = eventKey ?? 'all';

    setFilter((filter)=>({...filter, condition : condition }));
    setFilterName(eventKey);

    // setFilter만으로도 잘 작동한다면 제거해도 됨
    navigate(newUrl,  { state : {filter : {condition : condition}} });
  }

  function handleSort(eventKey, event) { // 검색 옵션 설정
    event.persist();
    let name = (event.currentTarget.id).split(".")[0];
    let ascend = (event.currentTarget.id).split(".")[1] ?? 'DESC';

    setOrder((order)=>({...order, name : name, ascend : ascend}));
    setOptionName(eventKey);

    // setOrder만으로도 잘 작동한다면 제거해도 됨
    navigate(newUrl,  { state : {order : {name : name, ascend : ascend}} });
}

    return(
      <div className={styles.buttonList}>
        <Dropdown onSelect={handleFilter} className={styles.option_dropdown}>
          <Dropdown.Toggle
          id="filter">
              {filterName}
          </Dropdown.Toggle>
          <Dropdown.Menu className={styles.drop_menu}>
              <Dropdown.Item eventKey='상'>상</Dropdown.Item>
              <Dropdown.Item eventKey='중'>중</Dropdown.Item>
              <Dropdown.Item eventKey='하'>하</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown onSelect={handleSort} className={styles.option_dropdown}>
          <Dropdown.Toggle
          id="order">
              {optionName}
          </Dropdown.Toggle>
          <Dropdown.Menu className={styles.drop_menu}>
              <Dropdown.Item id='createdAt' eventKey='최신등록순'>최신등록순</Dropdown.Item>
              <Dropdown.Item id='price.DESC' eventKey='높은가격순'>높은가격순</Dropdown.Item>
              <Dropdown.Item id='price.ASC' eventKey='낮은가격순'>낮은가격순</Dropdown.Item>
              <Dropdown.Item id='liked' eventKey='좋아요순'>좋아요순</Dropdown.Item>
              <Dropdown.Item id='view_count' eventKey='조회순'>조회순</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div> 
    )
}

export default ProductSorting;