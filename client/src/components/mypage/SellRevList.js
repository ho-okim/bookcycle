import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { sellReviewList } from '../../api/mypage';
import dateProcessing from '../../lib/dateProcessing.js';
import starRating from '../../lib/starRating.js';

import styles from '../../styles/mypage.module.css';


function SellRevList() {

  const { id } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function getReviews(){
      try {
        const data = await sellReviewList(id)
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
      <p>총 {reviews.length}개의 판매후기</p>
      <div className="rev-list">
        {reviews.map((review, index) => (
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
      <span>1 2 3 4 5 &gt;</span>
    </div>
  );
}

export default SellRevList;