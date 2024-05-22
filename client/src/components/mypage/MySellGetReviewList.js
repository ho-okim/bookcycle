import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sellGetReviewList } from '../../api/mypage';
import { dateProcessingDash } from '../../lib/dateProcessing.js';
import starRating from '../../lib/starRating.js';
import Pagination from './Pagination.js';

import styles from '../../styles/mypage.module.css';
import { Table } from 'react-bootstrap';


function MySellGetReviewList() {

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
      <p className={styles.contentHeader}> &gt; 총 {reviews.length}개의 구매자에게 받은후기</p>
      {reviews.length === 0 ? (
        <div className={styles.empty}>받은 후기가 없습니다.</div>
      ) : (
        <>
          <Table responsive>
            <tbody>
              {reviews.slice(offset, offset + limit).map((review, index) => (
                <tr key={index} className={styles.revWrap}>
                  <td>{starRating(review.score)}</td>
                  <td>{review.content}</td>
                  <td><Link to={`/user/${review.buyer_id}`}>{review.buyer_nickname}</Link></td>
                  <td className={`col-2 ${styles.date}`}>{dateProcessingDash(review.createdAt)}</td>
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

export default MySellGetReviewList;