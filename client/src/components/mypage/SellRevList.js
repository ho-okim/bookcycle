import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { sellReviewList } from '../../api/mypage';
import dateProcessing from '../../lib/dateProcessing.js';
import starRating from '../../lib/starRating.js';

import styles from '../../styles/mypage.module.css';


function SellRevList() {

  async function getReviews(){
    const data = await sellReviewList();
    return data
  }

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Axios 인스턴스를 이용하여 서버로부터 데이터 가져오기
    let items
    const test = async() => {
      items = await getReviews()
      setReviews(items)
    }
    test()
  }, []);

  return (
    <>
      <div className="rev-list">
        {reviews.map((review, index) => (
          <div key={index} className={`row ${styles.revWrap}`}>
            <div className="rating col col-2">{starRating(review.score)}</div>
            <div className="col col-6">{review.content}</div>
            <div className="col col-2">{review.buyer_nickname}</div>
            <div className="col-2">{dateProcessing(review.createdAt)}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default SellRevList;