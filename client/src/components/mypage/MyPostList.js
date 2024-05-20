import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postList } from '../../api/mypage';
import Pagination from './Pagination.js';
import dateProcessing from '../../lib/dateProcessing.js';

import { ChatLeftQuote } from 'react-bootstrap-icons';
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

  console.log(boardPostItems)

  return (
    <div className={styles.content}>
      <div className={`${styles.productListWrap}`}>
        <p className={styles.conTitle}> &gt; 상품 등록 내역</p>
        {productPostItems.length === 0 ? (
          <div className={`pb-5 ${styles.empty}`}>판매중인 상품이 없습니다.</div>
        ) : (
          productPostItems.slice(productOffset, productOffset + productLimit).map((item, index) => (
            <div key={index} className={styles.productWrap}>
              {
                item.filename ? 
                  <img src={process.env.PUBLIC_URL + `/img/product/${item.filename}`} alt="" className={styles.productImg}/> :
                  <img src={process.env.PUBLIC_URL + `/img/default/no_book_image.png`} alt="" className={styles.productImg}/>
              }
              <Link to={`/product/detail/${item.id}`} className={styles.productInfo}>
                <p className={styles.productTitle}>{item.product_name}</p>
                <p className={styles.productContent}>
                  <span>저자 {item.writer}</span>
                  <span>출판사 {item.publisher}</span>
                  <span>출간일 {dateProcessing(item.publish_date)}</span>
                </p>
                <p className={styles.productPrice}>₩{item.price}</p>
              </Link>
            </div>
          ))
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
              <div style={{width:'90%'}} >
                <Link to={`/board/${item.id}`}>
                  <p className={styles.boardTitle}>{item.title}</p>
                  <p className={styles.boardContent}>{item.content}</p>
                </Link>
                <div className={styles.boardInfo}>
                  <div>{dateProcessing(item.createdAt)}</div>
                  <div className={styles.boardReaction}>
                    <p>❤ <span className="ms-1">{item.likehit}</span></p>
                    <p><ChatLeftQuote size="20" className={styles.chatIcon}/> <span className="ms-1">{item.reply_numbers}</span></p>
                  </div>
                </div>
              </div>
              {/* {
                item.filename ?
                  files.map((el)=>{
                    return(
                      <img 
                        key={el.id}
                        src={process.env.PUBLIC_URL + `/img/board/${el.filename}`}
                        alt='board image' className={`${styles.boardImg}`}
                      />
                    )
                  }) : null
              } */}
              <img className={styles.boardImg} src="" />
            </div>
          ))
        )}
        <Pagination offset={boardOffset} limit={boardLimit} page={boardPage} total={boardTotal} setPage={setBoardPage}/>
      </div>
    </div>
  )

}

export default MyPostList;