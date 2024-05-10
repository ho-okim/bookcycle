import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { buyReviewList, reviewDelete } from '../../api/mypage';
import dateProcessing from '../../lib/dateProcessing.js';
import starRating from '../../lib/starRating.js';

import Dropdown from 'react-bootstrap/Dropdown';
import styles from '../../styles/mypage.module.css';


function BuyRevList() {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function getReviews(){
      try {
        const data = await buyReviewList();
        setReviews(data);
      } catch (error) {
        console.error('buyReviewList 데이터를 가져오는 중 에러 발생: ', error);
        setReviews([]); 
      }
    }
    getReviews();
  }, []);
  
  console.log(reviews)

  // 데이터 삭제
	async function onDelete(id) {
		try {
			await reviewDelete(id); 
			document.location.href = `/reviewDelete/${id}`
      navigate(0)
		} catch (error) {
			console.error(error);
		}
	}

  return (
    <div className={styles.content}>
      <p>총 {reviews.length}개의 구매후기</p>
      <div className="rev-list">
        {reviews.map((review, index) => (
          <div key={index} className={`row ${styles.revWrap}`}>
            <div className="rating col col-2">{starRating(review.score)}</div>
            <div className="col col-6">{review.content}</div>
            <div className="col col-1">{review.buyer_nickname}</div>
            <div className="col-2" style={{fontSize:''}}>{dateProcessing(review.createdAt)}</div>
            <Dropdown className="col col-1">
              <Dropdown.Toggle variant="success" id="dropdown-basic" className={styles.toggleBtn}>
                ⁝
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href={`/user/${review.seller_id}/reviewEdit?productId=${review.product_id}`}>
                  수정
                </Dropdown.Item>
                <Dropdown.Item onClick={() => onDelete(review.id)}>삭제</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        ))}
      </div>
      <span>1 2 3 4 5 &gt;</span>
    </div>
  );
}

export default BuyRevList;