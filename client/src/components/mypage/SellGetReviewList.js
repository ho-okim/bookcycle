import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sellGetReviewList } from '../../api/mypage';
import dateProcessing from '../../lib/dateProcessing.js';
import starRating from '../../lib/starRating.js';
import Pagination from './Pagination.js';

import styles from '../../styles/mypage.module.css';


function SellGetReviewList() {

  const [reviews, setReviews] = useState([]);

  let total = reviews.length; // 전체 게시물 수
  let limit = 10; // 페이지 당 게시물 수
  let [page, setPage] = useState(1); // 현재 페이지 번호
  let offset = (page - 1) * limit; // 페이지당 첫 게시물 위치

  useEffect(() => {
    async function getReviews(){
      try {
        const data = await sellGetReviewList();
        setReviews(data);
      } catch (error) {
        console.error('sellReviewList 데이터를 가져오는 중 에러 발생: ', error);
        setReviews([]); 
      }
    }
    getReviews();
  }, []);

  return (
    <div className={styles.content}>
      <p>총 {reviews.length}개의 판매 후 받은후기</p>
      {reviews.length === 0 ? (
        <div>아직 받은 후기가 없어요 😥</div>
      ) : (
        <>
          <div className="rev-list">
            {reviews.slice(offset, offset + limit).map((review, index) => (
              <div key={index} className={`row ${styles.revWrap}`}>
                <div className="rating col col-2">{starRating(review.score)}</div>
                <div className="col col-6">{review.content}</div>
                <div className="col col-2">
                  <Link to={`/user/${review.buyer_id}`}>{review.buyer_nickname}</Link>
                </div>
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

export default SellGetReviewList;