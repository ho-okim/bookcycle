import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productPostList } from '../../api/mypage';
import Pagination from './Pagination.js';
import { dateProcessingDash } from '../../lib/dateProcessing.js';
import Sorting from './Sorting.js';

import { Eye, ChatLeftQuote } from 'react-bootstrap-icons';
import styles from '../../styles/mypage.module.css';

// productPostList 정렬 옵션
const productSortOptions = [
  { label: "최신순", value: "createdAt.DESC" },
  { label: "오래된순", value: "createdAt.ASC" },
  { label: "가격낮은순", value: "price.ASC" },
  { label: "가격높은순", value: "price.DESC" },
  { label: "상품명순", value: "product_name.ASC" },
];

function MyProductPostList() {

  const [productPostItems, setProductPostItems] = useState([]);
  const [sortOption, setSortOption] = useState("createdAt.DESC")
  const [optionName, setOptionName] = useState('정렬기준'); // 버튼 이름

  let total = productPostItems.length;
  let limit = 10;
  let [page, setPage] = useState(1);
  let offset = (page - 1) * limit;

  useEffect(() => {
    async function getItems(){
      try {
        const data = await productPostList(sortOption);
        setProductPostItems(data);
      } catch (error) {
        console.error('postList 데이터를 가져오는 중 에러 발생: ', error);
        setProductPostItems([]);
      } 
    }
    getItems();
  }, [sortOption]);

  const handleChange = (eventKey, event) => {
    event.persist();
    setSortOption(eventKey);
    setOptionName(event.currentTarget.id);
  };

  return (
    <div className={styles.content}>
      <div className={styles.contentHeader}>
        <p> &gt; 상품 등록 내역</p>
        <Sorting optionName={optionName} handleChange={handleChange} options={productSortOptions} />
      </div>
        {productPostItems.length === 0 ? (
          <div className={`pb-5 ${styles.empty}`}>판매중인 상품이 없습니다.</div>
        ) : (
          <div className={styles.productList}>
            <div className={styles.productGrid}>
              {productPostItems.slice(offset, offset + limit).map((item, index) => (
                <div key={index} className={styles.productWrap}>
                  <Link to={`/product/detail/${item.id}`} className={styles.productInfo}>
                    <div className={styles.productImgWrap}>
                      {
                        item.filename ? 
                          <img src={process.env.PUBLIC_URL + `/img/product/${item.filename}`} alt="" className={styles.productImg}/> :
                          <img src={process.env.PUBLIC_URL + `/img/default/no_book_image.png`} alt="" className={styles.productImg}/>
                      }
                    </div>
                    <div className={styles.productContent}>
                      <p className={styles.productTitle}>{item.product_name}</p>
                      <p className={styles.productPrice}>{item.price.toLocaleString()}원</p>
                      <p className={styles.postDate}>{dateProcessingDash(item.createdAt)}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      <Pagination offset={offset} limit={limit} page={page} total={total} setPage={setPage}/>
    </div>
  )

}

export default MyProductPostList;