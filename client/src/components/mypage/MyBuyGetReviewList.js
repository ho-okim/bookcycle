import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buyGetReviewList } from '../../api/mypage';
import { dateProcessingDash } from '../../lib/dateProcessing.js';
import starRating from '../../lib/starRating.js';
import Pagination from './Pagination.js';

import styles from '../../styles/mypage.module.css';
import { Table } from 'react-bootstrap';

// 구매 후 받은 후기
function MyBuyGetReviewList() {
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
  

  return (
    <div className={styles.content}>
      <p className={styles.contentHeader}> &gt; 총 {reviews.length}개의 구매 후 받은 후기</p>
      {reviews.length === 0 ? (
        <div className={styles.empty}>판매자에게 받은 후기가 없습니다.</div>
      ) : (
        <>
          <Table responsive>
            <tbody>
              {reviews.slice(offset, offset + limit).map((review, index) => (
                <tr key={index} className={styles.revWrap}>
                  <td className={styles.star}>{starRating(review.score)}</td>
                  <td>{review.content}</td>
                  <td>{review.seller_nickname}</td>
                  <td>{dateProcessingDash(review.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination offset={offset} limit={limit} page={page} total={total} setPage={setPage}/>
        </>
      )}
    </div>
  );
}

export default MyBuyGetReviewList;