import styles from '../../styles/mypage.module.css';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { buyGetReviewList } from '../../api/mypage';
import { dateProcessingDash } from '../../lib/dateProcessing.js';
import starRating from '../../lib/starRating.js';
import Pagination from './Pagination.js';
import ReviewContent from './ReviewContent.js';


// 구매 후 받은 후기
function MyBuyGetReviewList() {
  const [reviews, setReviews] = useState([]);
  
  let total = reviews.length; // 전체 게시물 수
  let limit = 6; // 페이지 당 게시물 수
  let [page, setPage] = useState(1); // 현재 페이지 번호
  let offset = (page - 1) * limit; // 페이지당 첫 게시물 위치

  useEffect(() => {
    async function getReviews(){
      try {
        const data = await buyGetReviewList();
        setReviews(data);
      } catch (error) {
        console.error('구매 후 받은 후기 가져오는 중 에러 발생: ', error);
        setReviews([]); 
      }
    }
    getReviews();
  }, []);
  

  return (
    <div className={styles.content}>
      <p className={styles.contentHeader}> &gt; 총 {reviews.length}개의 구매 후 받은 후기</p>
      {reviews.length === 0 ? (
        <div className={styles.empty}>판매자에게 받은 후기가 없습니다.</div>
      ) : (
        <>
          <div className={styles.reviewList}>
            {reviews.slice(offset, offset + limit).map((review, index) => (
              <div key={index} className={styles.reviewWrap}>
                <div className='d-flex pb-2'>
                  <div className={`${styles.star} col-2`}>{starRating(review.score)}</div>
                  <div className='col-7'><Link to={`/user/${review.seller_id}`}>{review.seller_nickname}</Link></div>
                  <div className={`${styles.date} col-2 ms-auto text-end regular`}>{dateProcessingDash(review.createdAt)}</div>
                </div>
                <ReviewContent review={review.content}/>
              </div>
            ))}
          </div>
          <Pagination offset={offset} limit={limit} page={page} total={total} setPage={setPage}/>
        </>
      )}
    </div>
  );
}

export default MyBuyGetReviewList;