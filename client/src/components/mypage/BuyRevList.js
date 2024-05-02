import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { buyReviewList } from '../../api/mypage';
import dateProcessing from '../../lib/dateProcessing.js';
import starRating from '../../lib/starRating.js';

import Dropdown from 'react-bootstrap/Dropdown';
import styles from '../../styles/mypage.module.css';


function BuyRevList() {

  const { id } = useParams();

  async function getReviews(){
    const data = await buyReviewList(id)
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
            <div className="col col-1">{review.buyer_nickname}</div>
            <div className="col-2">{dateProcessing(review.createdAt)}</div>
            <Dropdown className="col col-1">
              <Dropdown.Toggle variant="success" id="dropdown-basic" className={styles.toggleBtn}>
                ⁝
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">수정</Dropdown.Item>
                <Dropdown.Item href="#/action-2">삭제</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        ))}
      </div>
    </>
  );
}

export default BuyRevList;