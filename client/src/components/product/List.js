import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link, useParams} from 'react-router-dom';
import {productList} from "../../api/product";
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
async function getProduct(){
  const data = await productList()
  return data;
}

let [product, productL] = useState([
  {
    product_name : '',
    wirter : '',
    publisher : '',
    public_date : '',
    price : ''
  }
])

/*
const [productList, setProductLIst] = useState([]);
*/
/*
useEffect(()=>{
  let product
  const test = async () => {
    product = await getProduct()
    productL(product),{
      product_name: rowData.product_name,
      wirter: rowData.writer,
      publisher: rowData.publisher,
      public_date: rowData.public_date,
      price: rowData.price
    }
  }
  test()
}, [])


  return (
            <div className={`${style.productDetailList}`}>
            <Link to={"/productDetail/:id"} style={{ textDecoration: "none", color: "black" }}>
              <div className={`${style.book}`}>
                <div clasName={`${style.bookpicbox}`}>
                  <img className="book-pic-box" src="" alt="사진" />
                </div>
                <div className={`${style.bookinfoabout}`}>
                  <div clasName="booktitle">{rowData.product_name}</div>
                  <div clasName="bookauthor">{rowData.wirter}, {rowData.publisher}, {rowData.public_date}</div>
                  <div clasName="bookprice">{rowData.price}</div>
                </div>
                <div clasName={`${style.booknicname}`}>닉네임</div>
              </div>
            </Link>
            </div>
  );
  */
};

export default List;
