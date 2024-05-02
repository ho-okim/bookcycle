import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link, useParams} from 'react-router-dom';
import style from "../../styles/productList.module.css";
import ProductDetail from '../../pages/product/ProductDetail';


function List(props){
/** 
 * 
 * async function getProduct(){
    const data = await productList()
    return data;
  }
 * 
 * 
*/



  return (
            <div className={`${style.productDetailList}`}>
            <Link to={"/productDetail/:id"} style={{ textDecoration: "none", color: "black" }}>
              <div className={`${style.book}`}>
                <div clasName={`${style.bookpicbox}`}>
                  <img className="book-pic-box" src="" alt="사진" />
                </div>
                <div className={`${style.bookinfoabout}`}>
                  <div clasName="booktitle">제목</div>
                  <div clasName="bookauthor">저자/출판사/출간일</div>
                  <div clasName="bookprice">가격</div>
                </div>
                <div clasName={`${style.booknicname}`}>닉네임</div>
              </div>
            </Link>
            </div>
  );
};

export default List;
