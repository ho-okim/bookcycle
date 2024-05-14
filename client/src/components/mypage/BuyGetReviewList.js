import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buyGetReviewList } from '../../api/mypage';
import dateProcessing from '../../lib/dateProcessing.js';
import starRating from '../../lib/starRating.js';
import Pagination from './Pagination.js';

import Dropdown from 'react-bootstrap/Dropdown';
import styles from '../../styles/mypage.module.css';

// 구매 후 받은 후기
function BuyGetReviewList() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  
  let total = reviews.length; // 전체 게시물 수
  let limit = 10; // 페이지 당 게시물 수
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
  
  console.log(reviews)

  return (
    <div className={styles.content}>
      <p>총 {reviews.length}개의 구매 후 받은 후기</p>
      {reviews.length === 0 ? (
        <div>아직 받은 후기가 없어요 😥</div>
      ) : (
        <>
          <div className="rev-list">
            {reviews.slice(offset, offset + limit).map((review, index) => (
              <div key={index} className={`row ${styles.revWrap}`}>
                <div className="rating col col-2">{starRating(review.score)}</div>
                <div className="col col-6">{review.content}</div>
                <div className="col col-1">{review.buyer_nickname}</div>
                <div className="col-2">{dateProcessing(review.createdAt)}</div>
              </div>
            ))}
          </div>
          <Pagination offset={offset} limit={limit} page={page} total={total} setPage={setPage}/>
        </>
      )}
    </div>
  );
}

export default BuyGetReviewList;