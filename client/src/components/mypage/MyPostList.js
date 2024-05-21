import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postList } from '../../api/mypage';
import Pagination from './Pagination.js';
import dateProcessing from '../../lib/dateProcessing.js';

import { Eye, ChatLeftQuote } from 'react-bootstrap-icons';
import styles from '../../styles/mypage.module.css';

function MyPostList() {

  const [productPostItems, setProductPostItems] = useState([]);
  const [boardPostItems, setBoardPostItems] = useState([]);

  let productTotal = productPostItems.length; // 전체 게시물 수
  let productLimit = 5; // 페이지 당 게시물 수
  let [productPage, setProductPage] = useState(1); // 현재 페이지 번호
  let productOffset = (productPage - 1) * productLimit; // 페이지당 첫 게시물 위치

  let boardTotal = boardPostItems.length; // 전체 게시물 수
  let boardLimit = 5; // 페이지 당 게시물 수
  let [boardPage, setBoardPage] = useState(1); // 현재 페이지 번호
  let boardOffset = (boardPage - 1) * boardLimit; // 페이지당 첫 게시물 위치

  useEffect(() => {
    async function getItems(){
      try {
        const data = await postList();
        setProductPostItems(data.productPost || []);
        setBoardPostItems(data.boardPost || []);
      } catch (error) {
        console.error('postList 데이터를 가져오는 중 에러 발생: ', error);
        setProductPostItems([]); // 에러 발생 시 빈 배열 저장
        setBoardPostItems([]); // 에러 발생 시 빈 배열 저장
      } 
    }
    getItems();
  }, []);

  console.log(productPostItems)

  return (
    <div className={styles.content}>
      <div className={`${styles.productListWrap}`}>
        <p className={styles.conTitle}> &gt; 상품 등록 내역</p>
        {productPostItems.length === 0 ? (
          <div className={`pb-5 ${styles.empty}`}>판매중인 상품이 없습니다.</div>
        ) : (
          <div className={styles.productList}>
            {productPostItems.slice(productOffset, productOffset + productLimit).map((item, index) => (
              <div key={index} className={styles.productWrap}>
                <Link to={`/product/detail/${item.id}`} className={styles.productInfo}>
                  {
                    item.filename ? 
                      <img src={process.env.PUBLIC_URL + `/img/product/${item.filename}`} alt="" className={styles.productImg}/> :
                      <img src={process.env.PUBLIC_URL + `/img/default/no_book_image.png`} alt="" className={styles.productImg}/>
                  }
                  <div className={styles.productContent}>
                    <p className={styles.productTitle}>{item.product_name}</p>
                    <p className={styles.productPrice}>₩{item.price}</p>
                    <p className={styles.postDate}>{dateProcessing(item.createdAt)}</p>
                  </div>
                </Link>
                <div className={styles.productReaction}>
                  <p className={styles.liked}>❤ <span>{item.liked}</span></p>
                  <p className={styles.count}><Eye size="18"/> <span>{item.view_count}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}
        <Pagination offset={productOffset} limit={productLimit} page={productPage} total={productTotal} setPage={setProductPage}/>
      </div>
      <div className={`border-top ${styles.boardListWrap}`}>
        <p className={styles.conTitle}> &gt; 게시글 작성 내역</p>
        {boardPostItems.length === 0 ? (
          <div className={`pb-5 ${styles.empty}`}>작성한 게시글이 없습니다.</div>
        ) : (
          boardPostItems.slice(boardOffset, boardOffset + boardLimit).map((item, index) => (
            <div key={index} className={styles.boardWrap}>
              <div className={`${styles.boardInfo} ${item.filename ? styles.withImage : styles.noImage}`} >
                <Link to={`/board/${item.id}`} className={styles.boardHeader}>
                  <p className={styles.boardTitle}>{item.title}</p>
                  <p className={styles.boardContent}>{item.content}</p>
                </Link>
                <div className={styles.boardBottom}>
                  <p className={styles.postDate}>{dateProcessing(item.createdAt)}</p>
                  <div className={styles.boardReaction}>
                    <p className={styles.liked}>❤ <span>{item.likehit}</span></p>
                    <p className={styles.count}><ChatLeftQuote size="20"/> <span>{item.reply_numbers}</span></p>
                  </div>
                </div>
              </div>
              {
                item.filename ?
                  <img key={item.id} src={process.env.PUBLIC_URL + `/img/board/${item.filename}`} alt='board image' className={`${styles.boardImg}`}/> : ''
              }
            </div>
          ))
        )}
        <Pagination offset={boardOffset} limit={boardLimit} page={boardPage} total={boardTotal} setPage={setBoardPage}/>
      </div>
    </div>
  )

}

export default MyPostList;