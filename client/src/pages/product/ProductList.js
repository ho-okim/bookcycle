import { Button, Navbar, Container, Nav, useNavigate } from "react-bootstrap";
import React, { useState, useEffect, Component } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/common.css";
import style from "../../styles/productList.module.css";
import List from "../../components/product/List.js";
import ProductCategory from "../../components/product/ProductCategory.js";
import ProductSorting from "../../components/user/UserProductSorting.js";


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
          <ProductSorting/>

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