import { Button, Navbar, Container, Nav, useNavigate } from "react-bootstrap";
import React, { useState, useEffect, Component } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/common.css";
import style from "../../styles/productList.module.css";
import ProductDetail from "./ProductDetail.js";
import List from "../../components/product/List.js";
import ProductCategory from "../../components/product/ProductCategory.js";


function ProductList() {

    /* 페이징 구현 중
        const { id } = useParams();

        const [page, setPage] = useState(1); //페이지
        const limit = 5; // posts가 보일 최대한의 갯수
        const offset = (page-1)*limit; // 시작점과 끝점을 구하는 offset

        const postsData = (posts) => {
        if(posts){
            let result = posts.slice(offset, offset + limit);
            return result;
        }
    }
    */
    function onSelected(){};

    
    return (
      <Container>
        <div className={`${style.inner}`}>
          <div className={`${style.buttonList}`}>
            <span>1 2 3 4 5 &gt; </span>
            <div className={`${style.productcondition}`}>
              {<select id="sort" className=" outline-none" onChange={onSelected}>
                  <option value="condition">상품상태</option>
                  <option value="conditiontop">상</option>
                  <option value="conditionmid">중</option>
                  <option value="conditionbo">하</option>
                </select>
              }
            </div>
            <div className={`${style.order}`}>
              {<select id="sort" className=" outline-none" onChange={onSelected}>
                  <option value="createdAt">최신순</option>
                  <option value="likeOrder">좋아요 순</option>
                </select>
              }
            </div>
          </div> 

          <div className={`${style.productLists}`}>
          <ProductCategory/>
            <div className={`${style.productDetailList}`}>
            <List/>
            </div>
          </div>
        </div>
      </Container>
    );
}

export default ProductList;