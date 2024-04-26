import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { buyReviewList } from '../../api/mypage';

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
  
  console.log("reviewList: ", reviews)

  function DateProcessing(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString("ko-KR", options).replaceAll('.', '.');
  }

  return (
    <>
      <div className="rev-list">
        {reviews.map((review, index) => (
          <div key={index} className={`row ${styles.revWrap}`}>
          {/* <div key={index} className="revWrap d-flex row"> */}
            <p className="rating col col-2">별점: {review.score}</p>
            <p className="col col-5">{review.content}</p>
            <p className="col col-2">구매자 id: {review.buyer_id}</p>
            <p className="col-2">{DateProcessing(review.createdAt)}</p>
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